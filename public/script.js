let panier = [];


function gen_elt(elt){
    let s =
     '<li class="list-group-item d-flex justify-content-between align-items-center">'
    +   '<div><span class="name-panier">'+elt.name+'</span>';
            if(elt.choice !== undefined){
                s+=' <i class="bi-info-circle choice-panier" data-toggle="tooltip" data-placement="top" title="'+elt.choice+'" nom="' + elt.choice +'"></i>'
            }
    s +='</div><div><span class="badge badge-secondary">'+(elt.price)+'€</span> <span class="badge badge-primary badge-pill badge-success">'+elt.number+'</span> '
    +'<span class="badge badge-primary badge-pill badge-danger rm-panier">-</span>'
    +'</div>'
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
    +   '<div><span class="badge badge-secondary">'+menu.price+'€</span></div>'
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
    '<li class="list-group-item d-flex justify-content-between align-items-center"><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#Modal">Commander</button><span class="badge badge-secondary">Total: '+totalPrice+'€</span></li>'
    +'</ul>';
    return $(p);
}

function update_panier() {
    $("#panierContainer").html(gen_panier());
    $("[data-toggle=tooltip]").tooltip();
    $(".rm-panier").click(function() {
        let name = $(this).parent().parent().find(".name-panier").text();
        let choice = $(this).parent().parent().find(".choice-panier").attr("nom");
        for(let i = 0; i < panier.length; i++) {
            if(panier[i].name === name && panier[i].choice === choice) {
                panier[i].number--;
                if(panier[i].number === 0) {
                    panier.splice(i, 1);
                }
                break;
            }
        } 
        update_panier();
        console.log(name + " + " + choice);
    });
}

function init_tab(n, str) {
    let tab = [];
    for(let i = 0; i < n; i++) {
        tab.push(str + " " + i);
    }
    console.log(tab);
    return tab;
}

function constr_grille(url,tab, type, menu) {
    console.log(menu);
    for (let i = 0; i < tab.length; i++) {
        tab[i].description = "jambonne, champignonne";
        let el = gen_presentation(url,tab[i], type, menu);
        //let el = gen_presentation(images, tab[i], "6€");
        $("#grille").append(el);
    }    
}

function nextMenuStep(url,menu){
    menu.number++;
    let nb;
    let nextStep;
    switch(menu.step){
        case "entrees": nb = menu.format.nb_entree; nextStep = "pizzas"; break;
        case "pizzas": nb = menu.format.nb_pizza; nextStep = "boissons"; break;
        case "boissons": nb = menu.format.nb_boisson; nextStep = "finish"; break;
    }
    if(menu.number < nb){
        get_data_and_switch(url,menu.step, menu);
    } else {
        menu.step = nextStep;
        if(menu.step !== "finish"){
            menu.number = 0;
            get_data_and_switch(url,nextStep, menu);
            let title = menu.step.charAt(0).toUpperCase() + menu.step.slice(1);
            moveBar("+=33.33%", title, "#menuBar", "#menuBarText");
        } else {
            menu.number = 1;
            $("#menuContainer").fadeOut("slow", function(){
                moveBar("0%", "Entrées", "#menuBar", "#menuBarText");
            });
            
            panier.push(menu);
            update_panier();
            get_data_and_switch(url,"menus");
        }

    }
}

function gen_presentation(url,e, type, menu){
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
    elt +=         '<button type="button" class="btn btn-success ajout" style="width: 100%;">'+(menu === undefined ? (e.menu?'Composer menu':'Ajouter au panier'):'choisir')+'</button>';
    if(type === 'pizzas') elt += '<button type="button" class="btn btn-succes personal" style="width:100%;">Personnaliser</button>';
    elt +=  '</div>'
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
    el.find(".ajout").click(function(){    
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

        if(menu === undefined){
            if(!e.menu){
                let o = {name: e.nom, price: p, menu: false, choice: choice, type: type,number:1};
                let added = false;
                for(let elt of panier){
                    if(elt.name !== "Pizza Personnalisée" && elt.name === o.name && elt.choice === o.choice){
                        elt.number++;
                        added = true;
                        break;
                    }
                }
                if(!added){
                    panier.push(o);
                }
                console.log(panier);
                update_panier();
            } else {
                let menu = {name: e.nom, price: p, menu: true, elts: [], number:1, format:e, step:"entrees", number: 0};
                console.log("MENUU");
                get_data_and_switch(url,"entrees", menu);
                $("#menuContainer").slideDown("slow");
                $("#menuBar").css("left", "0%");
            }
        } else {
            let o = {name: e.nom, price: p, type: type,choice: choice, number:1};
            let added = false;
            for(let elt of menu.elts){
                if(elt.name === o.name && elt.choice === o.choice){
                    elt.number++;
                    added = true;
                    break;
                }
            }
            if(!added){
                menu.elts.push(o);
            }
            nextMenuStep(url,menu);
        }
    });

    if(type === "pizzas") {
        el.find(".personal").click(function() {
            let taille = el.find("select").val();
            $.get(url + "pizza-ingr", {pizza:e.nom}, (ingr) => {
                console.log(ingr);
                init_perso(url,taille, new Map(ingr), menu);
            });
        });
    }

    return el;
}

function gen_bar_choice() {
    let persoContainer = $("#persoContainer");

    let card = '<div class="card" id="perso">'
                +  '<div class="card-header">'
                +      '<div class="progress" style="height: 32px">'
                +         '<div class="progress-bar progress-bar-striped progress-bar-animated" id="bar" role="progressbar" style="width: 33.33%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"><span id="barText">Taille</span></div>'
                +      '</div>'
                +  ' </div>'
                + '</div>';

    persoContainer.append(card);
    
    
}

function gen_taille_choice(taille, taille_select) {
    let perso = $("#perso");

    let div = "<div class='card-body' id='taille'>" +
                "<div class='row'>";
    for(let i = 0; i < taille.length; i++) {
        div += "<div class='col-4'>"
        div += "<div class='card img-hover choice choice-taille " 
        + (taille_select !== undefined && taille_select === taille[i].nom ? "active" : "") 
        + " mb-4'  prix='" + taille[i].prix + "' nom='" + taille[i].nom + "'>";
        div += "<img class='card-img-top' src='" + taille[i].image_url + "' alt='medium'></img>";
        div += "<div class='card-body'><h5 class='card-title text-center'>" + taille[i].nom + "</h5></div>";
        div += "</div></div>";
    }

    div += "</div></div>";
    perso.append(div);
}

function gen_ingr_choice(ingr, ingr_select) {
    let perso = $("#perso");

    let div = "<div class='card-body' id='ingr'>" +
                "<div class='row'>";
    for(let i = 0; i < ingr.length; i++) {
        div += "<div class='col-sm-6 col-md-6 col-lg-3 col-12'><div class='card choice choice-ingr img-hover'>";
        div += "<img class='card-img-top' src='" + ingr[i].image_url + "' alt='medium'></img>";
        div += "<div class='card-body elt'>" + "<p class='nom-ingr'>" + ingr[i].nom + "</p>" + "<p class='prix-ingr'>Gratuit</p>" + "</div>";
        div += "<div class='btn-group btn-group-justified' role='group'>"

        div += "<button type='button' class='btn btn-success add-elt'>+</button>"
        //div += "<div style='width=100%'>" + 0 + "</div>"
        let nb = 0;
        if(ingr_select !== undefined) {
            nb = ingr_select.get(ingr[i].nom);
            if(nb === undefined) nb = 0;
        }
        div += "<button type='button' class='btn count'>" + nb +"</button>"
        div += "<button type='button' class='btn btn-danger remove-elt'>-</button>"
        div += "</div>";
        div += "</div></div>";
    }

    div += "</div></div>";

    perso.append(div);
}

function gen_valid_choice(url,menu) {
    let perso = $("#perso");

    let div = "<div class='card-body text-center' id='valid'>";
    div += "<div id='recap'></div>"
    div += "<button type='button' id='valid-button' class='btn btn-primary'>Valider</button>" + "</div>";

    perso.append(div);

    $("#valid-button").click(function() {
        if(nb_ingr_selected > 0) {
            let prix_pizza = parseInt($(".choice-taille.active").attr("prix"));
            let prix_ingr_tot = Math.max((nb_ingr_selected - 3) * prix_ingr,0);
            let prix = prix_pizza + prix_ingr_tot;

            let ingr = "";
            for(elt of ingr_selected) {
                ingr += elt[1] + " " + elt[0] + ", ";
            }
            ingr = ingr.substring(0, ingr.length - 2);

            let o = {name: "Pizza Personnalisée", type:"pizzas" ,price: prix, menu: false, choice: $(".choice-taille.active").attr("nom") + " + " + ingr,taille: $(".choice-taille.active").attr("nom"), ingr: Array.from(ingr_selected), number:1};
            
            if(menu === undefined){
                panier.push(o);
                update_panier();
                $("#perso").fadeOut("slow", function() {
                    current_block = $("#grille");
                    $("#grille").fadeIn("slow");
                });
            } else {
                console.log(menu);
                menu.elts.push(o);
                nextMenuStep(url,menu);
            }
        }
    });
}

function gen_footer_choice() {

    let footer = "<div class='card-footer'>";
    footer += "<button type='button' id='prev' class='btn btn-outline-dark disabled'>Precedent</button>"
    footer += "<button type='button' id='next' class='btn btn-outline-success disabled'>Suivant</button>"
    footer += "<div class='text-right' id='prix-perso' style='float: right;'>Prix : 0€</div>"
    footer += "</div>";

    $("#perso").append(footer);
}
 
function moveBar(dir, s, bar, barText) {
    if(bar === undefined) bar = "#bar";
    if(barText === undefined) barText = "#barText";
    $(bar).animate({
        left: dir,
    }, 1000);
    $(barText).animate({
        opacity: 0,
    }, 500, function(){
        $(barText).text(s).animate({
            opacity: 1,
        }, 500);
    });
}

let current_block = $("#grille");
let taille_selected = false;
let nb_ingr_selected = 0;
let prix_ingr = 1.5;
let ingr_selected = new Map();

function get_data_and_switch(url, type, menu) {
    if(menu === undefined){
        $("#menuContainer").fadeOut("slow");
    } else {
        let text;
        let n;
        switch(type){
            case "entrees": text = "Entrée"; n = menu.format.nb_entree; break;
            case "pizzas": text = "Pizza"; n = menu.format.nb_pizza; break;
            case "boissons": text = "Boisson"; n = menu.format.nb_boisson; break;
        }
        $("#menuStep").text(text+" "+(menu.number+1)+"/"+n);
    }
    $.get(url + type, {}, (data) => {
        current_block.fadeOut("slow", function() {
            current_block = $("#grille");
            $("#grille").empty();
            console.log(data);
            for(let d of data) d.menu = (type === "menus");
            if(menu !== undefined){
                if(type === "boissons" || type === "pizzas"){
                    let tailles = type === "boissons" ? menu.format.tailles_boisson : menu.format.tailles_pizza;
                    for(let d of data){
                        console.log(menu);
                        for(let i = 0; i < d.choices.length; i++){
                            if(!tailles.includes(d.choices[i])){
                                d.choices.splice(i, 1);
                                i--;
                            }
                        }
                    }
                }
            }
            constr_grille(url,data, type, menu);

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

function init_choice_taille_button() {
    $(".choice-taille").click(function() {
        taille_selected = true;
        $(".choice-taille").removeClass("active");
        $(this).addClass("active");
        $("#next").addClass("activ").removeClass("disabled");
        update_price(nb_ingr_selected, prix_ingr);
        
    });
}

function init_add_elt_button() {
    $(".add-elt").click(function() {
        let elt = $(this).parent().find(".count");
        let ingr = $(this).parent().parent().find(".nom-ingr");
        let n = ingr_selected.get(ingr.text());
        if(n === undefined) ingr_selected.set(ingr.text(), 1);
        else ingr_selected.set(ingr.text(), n + 1);
        console.log(ingr_selected);
        nb_ingr_selected++;
        if(nb_ingr_selected == 3) {
            $(".prix-ingr").text(prix_ingr + "€");
        }

        let nb = parseInt(elt.text());
        nb += 1;
        elt.text(nb);

        update_price(nb_ingr_selected, prix_ingr);
    });
}

function init_rm_elt_button() {
    $(".remove-elt").click(function() {
        let elt = $(this).parent().find(".count");
        let ingr = $(this).parent().parent().find(".nom-ingr");

        let nb = parseInt(elt.text());
        if(nb !== 0) {

            let n = ingr_selected.get(ingr.text());
            if(n === 1) {
                ingr_selected.delete(ingr.text());
            }
            if(n !== undefined) ingr_selected.set(ingr.text(), n - 1);
            console.log(ingr_selected);

            nb_ingr_selected--;
            if(nb_ingr_selected === 2) {
                $(".prix-ingr").text("Gratuit");
            }
            nb--;
            elt.text(nb);
            update_price(nb_ingr_selected, prix_ingr);
        }
    }); 
}

function init_next_choice_button() {
    $("#next").click(function(){
        if(taille_selected) {
            if($("#bar").text() === "Taille") {
                $("#prev").removeClass("disabled");
                moveBar("+=33.33%", "Ingrédients");
                switch_slide($("#taille"), $("#ingr"));
            } else if($("#bar").text() === "Ingrédients"){
                moveBar("+=33.33%", "Validation"); 

                div = "<p>" + $(".choice-taille.active").attr("nom") + "</p>";
                for(elt of ingr_selected) {
                    div += "<p>" + elt[1] + " x " + elt[0] + "</p>";
                }

                $("#recap").empty().append(div);
                switch_slide($("#ingr"), $("#valid"));
                $(this).addClass("disabled");
            }
        }
    });
}

function init_prev_choice_button() {
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
}

function init_perso(url,taille_select, ingr_select, menu) {
    $.get(url + "ingr", {}, (ingr) => {
        $.get(url + "taille", {}, (taille) => {
            $("#grille").fadeOut("slow", function() {
                console.log(taille);
                console.log(ingr);
                current_block = $("#persoContainer");
                taille_selected = (taille_select !== undefined);
                nb_ingr_selected = 0;
                if(ingr_select !== undefined) {
                    for(elt of ingr_select) {
                        nb_ingr_selected += elt[1];
                    }
                }
                if(ingr_select === undefined) ingr_selected = new Map();
                else ingr_selected = ingr_select;

                console.log(taille_select);
                console.log(ingr_select);

                $("#persoContainer").empty();
                gen_bar_choice();
                gen_taille_choice(taille, taille_select);
                gen_ingr_choice(ingr, ingr_select);
                gen_valid_choice(url,menu);
                gen_footer_choice();

                $("#ingr").hide();
                $("#valid").hide();
                
                init_choice_taille_button();
                init_add_elt_button();
                init_rm_elt_button();
                init_next_choice_button();
                init_prev_choice_button();

                update_price(nb_ingr_selected, prix_ingr);

                $("#persoContainer").fadeIn("slow");
            });
        });
    });
}

$("document").ready(function() {
    console.log("COUCOU");

    let url = window.location.href;
    console.log(url);
    let i = 0;
    for(i = 1; i < url.length - 1; i++) {
        if(url[i] === '/' && url[i + 1] !== '/' && url[i - 1] !== '/') break;
    }
    url = url.substring(0, i + 1);
    

    $.get(url + "menus", {}, (data) => {
        console.log(data);
        for(let d of data) d.menu = true;
        constr_grille(url,data);
        $("#grille").fadeIn("slow");
    });

    $("#panierContainer").html(gen_panier());
    
    $("#persoContainer").hide();
    $("#menuContainer").hide();

    $("#nav-menus").click(function() {
        get_data_and_switch(url, "menus");
    });
    $("#nav-entrees").click(function() {
        get_data_and_switch(url, "entrees");
    });
    $("#nav-boissons").click(function() {
        get_data_and_switch(url, "boissons");
    });
    $("#nav-pizzas").click(function() {
        get_data_and_switch(url, "pizzas");
    });

    $("#nav-perso").click(function() {
        init_perso(url);
    }); 

    valid_form(url);
});

function valid_form(url) {
    $("#command-form").submit(function(event) {
        console.log("Plouc");
        event.preventDefault();
        $("#command-form").addClass("was-validated");
        if($(".command-input:invalid").length === 0) {
            // Envoyer une requete 

            
            $.post(url, {
                panier: panier, 
                nom: $("#Nom").val(), 
                prenom: $("#Prenom").val(), 
                addr: $("#addr").val(), 
                code: $("#code").val(), 
                num: $("#num").val(),
                email: $("#Email").val(),
                time: $("#Time").val(),
            });
            location.reload();
        }
    });
}