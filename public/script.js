function init_tab(n, str) {
    let tab = [];
    for(let i = 0; i < n; i++) {
        tab.push(str + " " + i);
    }
    console.log(tab);
    return tab;
}

function constr_grille(tab, images) {
    for (let i = 0; i < tab.length; i++) {
        let elt = gen_presentation(tab[i], "5€", images);
        let el = $(elt);
        $("#grille").append(el);
    }    
}

function gen_presentation(name, price, image){
    let elt = '<div class="col-sm-4 col-md-3 col-lg-2">';
    elt += '<div class="card mb-4 shadow-sm img-hover">'
    elt += '<img src="'+image+'" class="card-img-top" alt="image de '+name+'">'
    elt +=  '<div class="card-body"><h5 class="card-title">'+name+'</h5><p class="card-text">' + price + '</p>' + '</div></div></div>';
    return elt;
}

$("document").ready(function() {
    console.log("COUCOU");

    let menus = init_tab(5, "menu");
    let entrees = init_tab(20, "entree");
    let pizzas = init_tab(10, "pizza");
    let boissons = init_tab(15, "boisson");

    console.log(menus);
    constr_grille(menus, "menu.png");

    $("#nav-menus").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            constr_grille(menus, "menu.png");
            $("#grille").fadeIn("slow");
        });
    });

    $("#nav-entrees").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            constr_grille(entrees, "entree.png");
            $("#grille").fadeIn("slow");
        });
    });

    $("#nav-boissons").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            constr_grille(boissons, "boissons.png");
            $("#grille").fadeIn("slow");
        });
    });
    
    $("#nav-pizzas").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            constr_grille(pizzas, "pizza2.jpeg");
            $("#grille").fadeIn("slow");
        });
    });

});