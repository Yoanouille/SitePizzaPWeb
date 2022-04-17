function constr_grille(tab) {
    for (let i = 0; i < tab.length; i++) {
        let el = gen_presentation(tab[i].imageURL, tab[i].nom, tab[i].price,tab[i].prices_choices, tab[i].choices);
        //let el = gen_presentation(images, tab[i], "6€");
        $("#grille").append(el);
    }    
}

function gen_presentation(image, name, price, prices, choices){
    let multipleChoices = choices !== undefined;
    let first_price = price;
    if(multipleChoices) first_price += prices[0];
    let elt =
     '<div class="col-sm-6 col-md-4 col-lg-3">'
    +   '<div class="card mb-4 shadow-sm img-hover">'
    +       '<img src="'+image+'" class="card-img-top" alt="image de '+name+'">'
    +       '<div class="card-body">'
    +       '<h5 class="card-title">'+name+'</h5>'
    +       '<p id="price" class="card-text">' + (first_price) + '€</p>';
            if(multipleChoices){
               elt +='<select class="form-select mb-4" aria-label="Default select example" style="width: 100%;">'
                    for(let c of choices){
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
        for(let i = 0; i < choices.length; i++){
            if(choices[i] == $(this).val()){
                el.find("#price").text((price + prices[i]) + "€");
                break;
            }
        }
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
        div += "<div class='card-body'>" + "<p class='prix-ingr'>Gratuit</p>" + "</div>";
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
        $("#grille").fadeIn("slow");
    });

    let taille_selected = false;
    let nb_ingr_selected = 0;

    let taille = ["Medium", "Large", "XLarge"];
    let taille_image = ["test.png", "large.png", "Xlarge.png"];
    let tailles_prix  = [20, 30, 40];

    let ingredients = ["Jambon", "Bacon","Champignons", "Ognions", "Salades", "Oeufs"];
    let ingredients_image = ["coca.jpg", "menu.png", "plat.png", "pizza.png", "entree.png", "entree2.JPG"];
    let prix_ingr = 1.5;

    gen_taille_choice(taille, taille_image, tailles_prix);
    gen_ingr_choice(ingredients, ingredients_image);
    gen_valid_choice();
    gen_footer_choice();

    $("#ingr").hide();
    $("#valid").hide();

    $("#nav-menus").click(get_data("menus"));
    $("#nav-entrees").click(get_data("entrees"));
    $("#nav-boissons").click(get_data("boissons"));
    $("#nav-pizzas").click(get_data("pizzas"));

    $(".choice-taille").click(function() {
        taille_selected = true;
        $(".choice-taille").removeClass("active");
        $(this).addClass("active");
        $("#next").addClass("activ").removeClass("disabled");
        update_price(nb_ingr_selected, prix_ingr);
        
    });

    // $(".choice-ingr").click(function() {
    //     if($(this).find("span").length == 0) {
    //         $(this).find(".card-body").append("<span class='badge badge-primary badge-pill'>1</span><button type='button' class='btn btn-danger remove-elt'><p style='font-weight: bold; display: inline; z-index=5;'>-</p></button>")
    //         $(this).addClass("active");
    //     } else {
    //         let nb = parseInt($(this).find("span").text());
    //         nb += 1
    //         $(this).find("span").text(nb);
    //     }
    //     nb_ingr_selected ++;
    //     if(nb_ingr_selected == 3) {
    //         $(".prix-ingr").text(prix_ingr + "€");
    //     }
    //     update_price(nb_ingr_selected, prix_ingr);
    // });

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
            } else {
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