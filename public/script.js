//Le panier du client
let panier = [];

//Le bloc actuellement visible
let current_block = {block:$("#grille")};

//fonction qui permet d'enlever un élément du panier
function remove_elt_panier_with_index(elt) {
    let li = elt.parent().parent();
    let ul = li.parent();
    let lis = ul.children();
    for(let i = 0; i < lis.length; i++) {
        if(lis.eq(i).is(li)) {
            console.log(i);
            panier[i - 1].number--;
            if(panier[i - 1].number <= 0) panier.splice(i - 1, 1);
            update_panier();
            break;
        }
    }
}

//fonction qui update le panier sur la page commande
function update_panier() {
    $("#panierContainer").html(gen_panier(panier, false));
    $("[data-toggle=tooltip]").tooltip();
    $(".rm-panier").click(function() {
        remove_elt_panier_with_index($(this));
    });
    $(".panier-rm-menu").click(function() {
        remove_elt_panier_with_index($(this));
    });
}


//Fonction qui contruit toutes la grille de droite dans la page commande
function constr_grille(url,tab, type, menu) {
    console.log(menu);
    if(type === 'pizzas') $("#grille").append(gen_perso_card(url, menu));
    for (let i = 0; i < tab.length; i++) {
        if(tab[i].menu !== undefined || menu !== undefined || tab[i].choice !== undefined) {
            let el = gen_presentation(url,tab[i], type, menu);
            $("#grille").append(el);
        }
    }    
}

//Fonction qui génère le html de la carte du choix de la pizza personnalisée
function gen_perso_card(url, menu) {
    let elt =
     '<div class="col-sm-6 col-md-4 col-lg-3">'
    +   '<div class="card mb-4 shadow-sm img-hover">'
    +       '<img src="images/pizza/Xlarge.jpg" class="card-img-top" alt="image perso">'
    +       '<div class="card-body">'
    +       '<h5 class="card-title">Pizza Personalisée</h5>'
    +       '<p>Contruisez votre Pizza !</p>'
    +       '<p id="price" class="card-text">A partir de 10€</p>';
            
    elt +=         '<button type="button" class="btn btn-success ajout" style="width: 100%;">Créer la Pizza</button>';
    elt +=  '</div>'
    +   '</div>'
    +'</div>';

    let el = $(elt);

    //Ajout de la fonction init_perso au bouton
    el.find("button").click(function() {
        init_perso(url, current_block, undefined, undefined,menu);
    });

    return el;
    
}

//Fonction qui génère le html de l'élément e qui peut être un menu/pizza/boisson/entrée
function gen_elt_pres(e, first_price, multipleChoices,type, menu) {
    let elt = '<div class="col-sm-6 col-md-4 col-lg-3">'
    +   '<div class="card mb-4 shadow-sm img-hover">'
    +       '<img src="'+e.imageURL+'" class="card-img-top" alt="image de '+e.nom+'">'
    +       '<div class="card-body">'
    +       '<h5 class="card-title">'+e.nom+'</h5>'
    +       '<p>'+e.description+'</p>'
    +       (menu === undefined ?'<p id="price" class="card-text">' + (first_price) + '€</p>' : '');
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
    return elt;
}


//Ajoute la fonction de selection qui change le prix sur les <select>
function elt_select_function(el, e) {
    el.find("select").change(function(){
        for(let i = 0; i < e.choices.length; i++){
            if(e.choices[i] == $(this).val()){
                el.find("#price").text((e.price + e.prices_choices[i]) + "€");
                break;
            }
        }
    });
}


//Fonction qui permet de passer à la prochaine étape du menu
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

//Fonction qui permet d'ajouter un élément dans le panier/ ou si c'est un menu de lancer le choix du menu
function elt_add_function(el, url, e, multipleChoices,type, menu) {
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

        //Teste si on est dans le choix d'un menu
        if(menu === undefined){
            //Si on est pas dans le choix d'un menu
            if(!e.menu){
                //Si c'est pas un menu on l'ajoute dans le panier
                //Soit on incrémente le nb 
                //Soit on l'ajoute
                let o = {name: e.nom, price: p, menu: false, choice: choice, type: type,number:1};
                let added = false;
                for(let elt of panier){
                    if(elt.name !== "Pizza Personnalisée" && elt.name === o.name && elt.choice === o.choice){
                        elt.number++;
                        added = true;
                        break;
                    }
                }
                if(!added) panier.push(o);
                update_panier();
            } else {
                //Si c'est un menu
                //On lance le choix des éléments du menu
                let menu = {name: e.nom, price: p, menu: true, elts: [], number:1, format:e, step:"entrees", number: 0};
                get_data_and_switch(url,"entrees", menu);
                $("#menuContainer").slideDown("slow");
                $("#menuBar").css("left", "0%");
            }
        } else {
            //Si on est dans le choix d'un menu
            //On l'ajoute aux éléments du menu
            let o = {name: e.nom, price: p, type: type,choice: choice, number:1};
            let added = false;
            for(let elt of menu.elts){
                if(elt.name === o.name && elt.choice === o.choice){
                    elt.number++;
                    added = true;
                    break;
                }
            }
            if(!added) menu.elts.push(o);
            //On appelle la prochaine étape du menu
            nextMenuStep(url,menu);
        }
    });
}

//Fonction ajoute la fonction permettant de pouvoir personaliser ses pizzas 
function elt_perso_function(el, url, e, menu) {
    el.find(".personal").click(function() {
        let taille = el.find("select").val();
        $.get(url + "pizza-ingr", {pizza:e.nom}, (ingr) => {
            init_perso(url,current_block,taille, new Map(ingr), menu);
        });
    });
}

//Fonction qui génère le html d'un élement et ajoute les fonctions aux boutons
function gen_presentation(url,e, type, menu){
    let multipleChoices = e.choices !== undefined;
    let first_price = e.price;
    if(multipleChoices) first_price += e.prices_choices[0]; 
    
    let el = $(gen_elt_pres(e, first_price, multipleChoices, type, menu));
    elt_select_function(el, e);
    elt_add_function(el, url,e, multipleChoices, type, menu);
    
    if(type === "pizzas") elt_perso_function(el, url, e,menu);

    return el;
}

//Fonction qui permet de déplacer la bar des progress bar
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

//Fonction qui récupère auprès du serveur certaines données
//Génère la présentation et switch avec un effet de fade entre l'ancien et le nouveau écran
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
    //requete get pour récupérer ce qu'on a besoin
    $.get(url + type, {}, (data) => {
        //switch
        current_block.block.fadeOut("slow", function() {
            current_block.block = $("#grille");
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
            //génération de la présentation
            constr_grille(url,data, type, menu);

            $("#grille").fadeIn("slow");
        });
    });
}

//le main
$("document").ready(function() {

    //récupération de l'addresse
    let url = window.location.href;
    console.log(url);
    let i = 0;
    for(i = 1; i < url.length - 1; i++) {
        if(url[i] === '/' && url[i + 1] !== '/' && url[i - 1] !== '/') break;
    }
    url = url.substring(0, i + 1);
    
    //initialisation de la page sur menu
    $.get(url + "menus", {}, (data) => {
        console.log(data);
        for(let d of data) d.menu = true;
        constr_grille(url,data);
        $("#grille").fadeIn("slow");
    });

    //initialisation du panier
    $("#panierContainer").html(gen_panier(panier, false));
    

    $("#persoContainer").hide();
    $("#menuContainer").hide();

    //initialisation des boutons de nav
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

    //initialisation du formulaire
    valid_form(url);
});


//fonction qui s'active lors d'un passage de commande
//Et si tout est bon, lance une requête post au serveur pour insérer la commande dans la bd
function valid_form(url) {
    $("#command-form").submit(function(event) {
        event.preventDefault();
        $("#command-form").addClass("was-validated");
        if($(".command-input:invalid").length === 0) {
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
            $('#Modal').modal('toggle');
            $('#Success').modal('toggle');
            panier = [];
            update_panier();
        }
    });
}