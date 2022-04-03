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
        let elt = '<div class="col-4 col-sm-3 col-md-2 col-lg-1 case text-center">';
        elt += '<img src=' + images + '.png />';
        elt +=  '<p>' + tab[i] + '</p>' + '</div>'
        let el = $(elt);
        $("#grille").append(el);
    }    
}


$("document").ready(function() {
    console.log("COUCOU");

    let menus = init_tab(5, "menu");
    let entrees = init_tab(20, "entree");
    let pizzas = init_tab(10, "pizza");
    let boissons = init_tab(15, "boisson");

    console.log(menus);
    constr_grille(menus, "menu");

    $("#nav-menus").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            constr_grille(menus, "menu");
            $("#grille").fadeIn("slow");
        });
    });

    $("#nav-entrees").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            constr_grille(entrees, "entrees");
            $("#grille").fadeIn("slow");
        });
    });

    $("#nav-boissons").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            constr_grille(boissons, "boissons");
            $("#grille").fadeIn("slow");
        });
    });
    
    $("#nav-pizzas").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            constr_grille(pizzas, "pizza");
            $("#grille").fadeIn("slow");
        });
    });

});