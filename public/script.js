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
    for(let elt of menu.elts){
            s += gen_menu_elt(elt);
    }
    s+=      '</div>'
    +   '</div>'
    +   '<div><span class="badge badge-secondary">'+menu.price+'€</span> <span class="panier-rm-menu badge badge-primary badge-pill badge-danger" > - </span></div>'
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
    if(totalPrice === 0)
        p += '<li class="list-group-item d-flex justify-content-between align-items-center"><button type="button" class="btn btn-success">Commander</button><span class="badge badge-secondary">Total: '+totalPrice+'€</span></li>'
    else
        p += '<li class="list-group-item d-flex justify-content-between align-items-center"><button type="button" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#Modal">Commander</button><span class="badge badge-secondary">Total: '+totalPrice+'€</span></li>'
    p += '</ul>';
    return $(p);
}

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

function update_panier() {
    $("#panierContainer").html(gen_panier());
    $("[data-toggle=tooltip]").tooltip();
    $(".rm-panier").click(function() {
        remove_elt_panier_with_index($(this));
    });
    $(".panier-rm-menu").click(function() {
        remove_elt_panier_with_index($(this));
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
    if(type === 'pizzas') {
        console.log(type);
        console.log(url);
        $("#grille").append(gen_perso_card(url, menu));
    }
    for (let i = 0; i < tab.length; i++) {
        if(tab[i].menu !== undefined || menu !== undefined || tab[i].choice !== undefined) {
            let el = gen_presentation(url,tab[i], type, menu);
            //let el = gen_presentation(images, tab[i], "6€");
            $("#grille").append(el);
        }
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

function gen_perso_card(url, menu) {
    let elt =
     '<div class="col-sm-6 col-md-4 col-lg-3">'
    +   '<div class="card mb-4 shadow-sm img-hover">'
    +       '<img src="images/pizza/Xlarge.jpg" class="card-img-top" alt="image perso">'
    +       '<div class="card-body">'
    +       '<h5 class="card-title">Pizza Personalisée</h5>'
    +       '<p>Contruisez votre Pizza !</p>'
    +       '<p id="price" class="card-text">A partir de 20€</p>';
            
    elt +=         '<button type="button" class="btn btn-success ajout" style="width: 100%;">Créer la Pizza</button>';
    elt +=  '</div>'
    +   '</div>'
    +'</div>';

    let el = $(elt);
    el.find("button").click(function() {
        init_perso(url, current_block, undefined, undefined,menu);
    });

    return el;
    
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
                init_perso(url,current_block,taille, new Map(ingr), menu);
            });
        });
    }

    return el;
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

let current_block = {block:$("#grille")};


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
            constr_grille(url,data, type, menu);

            $("#grille").fadeIn("slow");
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

    valid_form(url);
});

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