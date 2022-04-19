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
        $("#panierContainer").show();
        /*$("#panier").css("width: 0px;");
        $("#panier").animate({
            width: "300px"
        }, 1000);*/
    });
    return el;
}

$("document").ready(function() {

    $("#panierContainer").hide();

    // let menus = init_tab(5, "menu");
    // let entrees = init_tab(20, "entree");
    // //let pizzas = init_tab(10, "pizza");
    // let boissons = init_tab(15, "boisson");

    // console.log(menus);
    // constr_grille(menus, "menu.png");
    $.get("http://localhost:8080/menus", {}, (data) => {
        console.log(data);
        constr_grille(data);
        for(let d of data) d.menu = true;
        $("#grille").fadeIn("slow");
    });

    $("#nav-menus").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            $.get("http://localhost:8080/menus", {}, (data) => {
                console.log(data);
                for(let d of data) d.menu = true;
                constr_grille(data);
                $("#grille").fadeIn("slow");
            });
        });
    });

    $("#nav-entrees").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            $.get("http://localhost:8080/entrees", {}, (data) => {
                console.log(data);
                constr_grille(data);
                $("#grille").fadeIn("slow");
            });
        });
    });

    $("#nav-boissons").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            $.get("http://localhost:8080/boissons", {}, (data) => {
                console.log(data);
                constr_grille(data);
                $("#grille").fadeIn("slow");
            });
        });
    });
    
    $("#nav-pizzas").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();  
            $.get("http://localhost:8080/pizzas", {}, (data) => {
                console.log(data);
                constr_grille(data);
                $("#grille").fadeIn("slow");
            });
        });
    });

});