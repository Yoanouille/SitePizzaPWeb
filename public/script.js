let panier = [];


function gen_elt(elt){
    let s =
     '<li class="list-group-item d-flex justify-content-between align-items-center">'
    +   '<div>'+elt.name;
            if(elt.choice !== undefined){
                s+=' <i class="bi-info-circle" data-toggle="tooltip" data-placement="top" title="'+elt.choice+'"></i>'
            }
    s +='</div><div><span class="badge badge-secondary">'+(elt.price)+'€</span> <span class="badge badge-primary badge-pill badge-success">'+elt.number+'</span></div>'
    +'</li>';
    return s;
}

function gen_menu_elt(elt){
    let s =
     '<div class="dropdown-item">'+elt.name;
            if(elt.choice !== undefined){
                s+=' <i class="bi-info-circle" data-toggle="tooltip" data-placement="top" title="'+elt.choice+'"></i>'
            }
    s +=' <span class="badge badge-primary badge-pill badge-success">'+elt.number+'</span>'
    +'</div>';
    return s;
}

function gen_menu(menu){
    let s =
     '<li class="list-group-item d-flex justify-content-between align-items-center">'
    +   '<div class="dropdown">'
    +      '<button class="btn btn-secondary dropdown-toggle bg-light text-dark" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
    +          menu.name
    +      '</button>'
    +      '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
    //+          '<div class="dropdown-item">Salade César <i class="bi-info-circle" data-toggle="tooltip" data-placement="top" title="sauce ketchup"></i></div>'
    //+          '<div class="dropdown-item">Pizza Calzone <i class="bi-info-circle" data-toggle="tooltip" data-placement="top" title="XLarge"></i> <span class="badge badge-primary badge-pill badge-success">2</span></div>';
    for(let elt of menu.elts){
            s += gen_menu_elt(elt);
    }
    s+=      '</div>'
    +   '</div>'
    +   '<div><span class="badge badge-secondary">15€</span></div>'
    +'</li>';
    return s;
}

function gen_panier(){
    let p =
     '<ul id="panier" class="list-group shadow-sm">'
    +'<li class="list-group-item text-center"><h4>Panier</h4></li>';
        let totalPrice = 0;
        for(let elt of panier){
            totalPrice += elt.price*elt.number;
            if(elt.menu === true){
                p += gen_menu(elt);
            } else {
                p += gen_elt(elt);
            }
        }
    p +=
    '<li class="list-group-item d-flex justify-content-between align-items-center"><button type="button" class="btn btn-success">Commander</button><span class="badge badge-secondary">Total: '+totalPrice+'€</span></li>'
    +'</ul>';
    return $(p);
}

function init_tab(n, str) {
    let tab = [];
    for(let i = 0; i < n; i++) {
        tab.push(str + " " + i);
    }
    console.log(tab);
    return tab;
}

function constr_grille(tab) {
    for (let i = 0; i < tab.length; i++) {
        tab[i].description = "jambonne, champignonne";
        let el = gen_presentation(tab[i]);
        //let el = gen_presentation(images, tab[i], "6€");
        $("#grille").append(el);
    }    
}

function gen_presentation(e){
    let multipleChoices = e.choices !== undefined;
    let first_price = e.price;
    if(multipleChoices) first_price += e.prices_choices[0];
    let elt =
     '<div class="col-sm-6 col-md-4 col-lg-3">'
    +   '<div class="card mb-4 shadow-sm img-hover">'
    +       '<img src="'+e.imageURL+'" class="card-img-top" alt="image de '+e.nom+'">'
    +       '<div class="card-body">'
    +       '<h5 class="card-title">'+e.nom+'</h5>'
    +       '<p>'+e.description+'</p>'
    +       '<p id="price" class="card-text">' + (first_price) + '€</p>';
            if(multipleChoices){
               elt +='<select class="form-select mb-4" aria-label="Default select example" style="width: 100%;">'
                    for(let c of e.choices){
                        elt += '<option>'+c+'</option>';
                    }
                elt +='</select>';
            }
    elt +=         '<button type="button" class="btn btn-success" style="width: 100%;">Ajouter au panier</button>'
    +       '</div>'
    +   '</div>'
    +'</div>';
    
    let el = $(elt);
    el.find("select").change(function(){
        for(let i = 0; i < e.choices.length; i++){
            if(e.choices[i] == $(this).val()){
                el.find("#price").text((e.price + e.prices_choices[i]) + "€");
                break;
            }
        }
    });
    el.find("button").click(function(){    
        let choice = el.find("select").val();
        let p = 0;
        if(multipleChoices){
            for(let i = 0; i < e.choices.length; i++){
                if(e.choices[i] == choice){
                    p = e.price + e.prices_choices[i]
                    break;
                }
            } 
        } else {
            p = e.price;
        }
        
        if(e.menu !== true){
            let o = {name: e.nom, price: p, menu: false, choice: choice, number:1};
            let added = false;
            for(let elt of panier){
                if(elt.name === o.name && elt.choice === o.choice){
                    elt.number++;
                    added = true;
                    break;
                }
            }
            if(!added){
                panier.push(o);
            }
        } else {
            panier.push({name: e.nom, price: p, menu: true, elts: [{name: "Salade César", price: 6, number: 2}, {name: "Pizza Calzone", price: 12, choice:"XLarge", number: 2}], number:1});
        }

        console.log(panier);
        $("#panierContainer").html(gen_panier());
        $("[data-toggle=tooltip]").tooltip();
        $("#grilleContainer").removeClass("col-sm-12").addClass("col-sm-8 col-lg-9");
        //$("#persoContainer").removeClass("col-sm-12").addClass("col-sm-8 col-lg-9");
        $("#panierContainer").show();
        /*$("#panier").css("width: 0px;");
        $("#panier").animate({
            width: "300px"
        }, 1000);*/
    });
    return el;
}

function gen_taille_choice(taille, taille_image, taille_prix) {
    let perso = $("#perso");

    let div = "<div class='card-body' id='taille'>" +
                "<div class='row'>";
    for(let i = 0; i < taille.length; i++) {
        div += "<div class='card img-hover choice choice-taille col-4'  prix='" + taille_prix[i] + "'>";
        div += "<img class='card-img-top' src='" + taille_image[i] + "' alt='medium'></img>";
        div += "<div class='card-body'>" + "" + "</div>";
        div += "</div>";
    }

    div += "</div></div>";
    perso.append(div);
}

function gen_ingr_choice(ingr, ingr_image) {
    let perso = $("#perso");

    let div = "<div class='card-body' id='ingr'>" +
                "<div class='row'>";
    for(let i = 0; i < ingr.length; i++) {
        div += "<div class='col-sm-6 col-md-4 col-lg-2 col-6'><div class='card img-hover choice choice-ingr'>";
        div += "<img class='card-img-top' src='" + ingr_image[i] + "' alt='medium'></img>";
        div += "<div class='card-body elt'>" + "<p class='prix-ingr'>Gratuit</p>" + "</div>";
        div += "<div class='btn-group btn-group-justified' role='group'>"

        div += "<button type='button' class='btn btn-success add-elt'>+</button>"
        //div += "<div style='width=100%'>" + 0 + "</div>"
        div += "<button type='button' class='btn count'>0</button>"
        div += "<button type='button' class='btn btn-danger remove-elt'>-</button>"
        div += "</div>";
        div += "</div></div>";
    }

    div += "</div></div>";

    perso.append(div);
}

function gen_valid_choice() {
    let perso = $("#perso");

    let div = "<div class='card-body text-center' id='valid'>";
    div += "<button type='button' id='valid-button' class='btn btn-primary'>Valider</button>" + "</div>";

    perso.append(div);
}

function gen_footer_choice() {

    let footer = "<div class='card-footer'>";
    footer += "<button type='button' id='prev' class='btn btn-outline-dark disabled'>Precedent</button>"
    footer += "<button type='button' id='next' class='btn btn-outline-success disabled'>Suivant</button>"
    footer += "<div class='text-right' id='prix-perso' style='float: right;'>Prix : 0€</div>"
    footer += "</div>";

    $("#perso").append(footer);
}
 
function moveBar(dir, s) {
    $("#bar").animate({
        left: dir,
    }, 1000);
    $("#barText").animate({
        opacity: 0,
    }, 500, function(){
        $("#barText").text(s).animate({
            opacity: 1,
        }, 500);
    });
}

function get_data(type) {
    $("#grille").fadeOut("slow", function() {
        $("#grille").empty();
        $.get("http://localhost:8080/" + type, {}, (data) => {
            console.log(data);
            constr_grille(data);
            $("#grille").fadeIn("slow");
        });
    });
}

function switch_slide(b1, b2) {
    b1.slideToggle(500, function() {
        b2.slideToggle(500);
    })
}

function update_price(nb_ingr, prix_ingr) {
    let prix_pizza = parseInt($(".choice-taille.active").attr("prix"));
    console.log(prix_pizza);
    let prix_ingr_tot = Math.max((nb_ingr - 3) * prix_ingr,0);
    let prix = prix_pizza + prix_ingr_tot;
    $('#prix-perso').text("Prix : " + prix + "€");
}

$("document").ready(function() {
    console.log("COUCOU");
    $.get("http://localhost:8080/menus", {}, (data) => {
        console.log(data);
        constr_grille(data);
        for(let d of data) d.menu = true;
        $("#grille").fadeIn("slow");
    });

    let taille_selected = false;
    let nb_ingr_selected = 0;

    let taille = ["Medium", "Large", "XLarge"];
    let taille_image = ["images/test.png", "images/large.png", "images/Xlarge.png"];
    let tailles_prix  = [20, 30, 40];

    let ingredients = ["Jambon", "Bacon","Champignons", "Ognions", "Salades", "Oeufs"];
    let ingredients_image = ["images/coca.jpg", "images/menu.png", "images/plat.png", "images/pizza.png", "images/entree.png", "images/entree2.JPG"];
    let prix_ingr = 1.5;

    gen_taille_choice(taille, taille_image, tailles_prix);
    gen_ingr_choice(ingredients, ingredients_image);
    gen_valid_choice();
    gen_footer_choice();

    $("#persoContainer").hide();
    $("#ingr").hide();
    $("#valid").hide();

    $("#nav-menus").click(function() {
        get_data("menus");
    });
    $("#nav-entrees").click(function() {
        get_data("entrees");
    });
    $("#nav-boissons").click(function() {
        get_data("boissons");
    });
    $("#nav-pizzas").click(function() {
        get_data("pizzas");
    });

    $("#nav-perso").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#persoContainer").fadeIn("slow");
        });
    });

    $(".choice-taille").click(function() {
        taille_selected = true;
        $(".choice-taille").removeClass("active");
        $(this).addClass("active");
        $("#next").addClass("activ").removeClass("disabled");
        update_price(nb_ingr_selected, prix_ingr);
        
    });

    $(".add-elt").click(function() {
        let elt = $(this).parent().find(".count");
        nb_ingr_selected++;
        if(nb_ingr_selected == 3) {
            $(".prix-ingr").text(prix_ingr + "€");
        }

        let nb = parseInt(elt.text());
        nb += 1;
        elt.text(nb);

        update_price(nb_ingr_selected, prix_ingr);
    });

    $(".remove-elt").click(function() {
        let elt = $(this).parent().find(".count");
        let nb = parseInt(elt.text());
        if(nb !== 0) {
            nb_ingr_selected--;
            if(nb_ingr_selected === 2) {
                $(".prix-ingr").text("Gratuit");
            }
            nb--;
            elt.text(nb);
            update_price(nb_ingr_selected, prix_ingr);
        }
    }); 

    $("#next").click(function(){
        if(taille_selected) {
            if($("#bar").text() === "Taille") {
                $("#prev").removeClass("disabled");
                moveBar("+=33.33%", "Ingrédients");
                switch_slide($("#taille"), $("#ingr"));
            } else if($("#bar").text() === "Ingrédients"){
                moveBar("+=33.33%", "Validation"); 
                switch_slide($("#ingr"), $("#valid"));
                $(this).addClass("disabled");
            }
        }
    });

    $("#prev").click(function() {
        if($("#bar").text() === "Taille") return;
        if($("#bar").text() === "Ingrédients") {
            moveBar("-=33.33%", "Taille");
            switch_slide($("#ingr"), $("#taille"));
            $(this).addClass("disabled");
        } else {
            moveBar("-=33.33%", "Ingrédients");
            switch_slide($("#valid"), $("#ingr")); 
            $("#next").removeClass("disabled");
        }
    });

});