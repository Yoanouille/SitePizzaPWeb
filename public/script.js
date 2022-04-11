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
    
    /*'<div class="col-sm-4 col-lg-3">'+
    '<div class="card mb-4 shadow-sm img-hover">'+
      '<img src="pizza2.jpeg" class="img-fluid" alt="Responsive image">'+
      '<div class="card-body">'+
        '<h4>Neuroevolution of Simulated Creatures</h3>'+
        '<p class="card-text">A neural network learns to control a simulated creature using a genetic algorithm</p>'+
        '<div class="d-flex justify-content-between align-items-center">'+
        '</div></div></div></div>';*/
}

$("document").ready(function() {
    console.log("COUCOU");

    // let menus = init_tab(5, "menu");
    // let entrees = init_tab(20, "entree");
    // //let pizzas = init_tab(10, "pizza");
    // let boissons = init_tab(15, "boisson");

    // console.log(menus);
    // constr_grille(menus, "menu.png");
    $.get("http://localhost:8080/menus", {}, (data) => {
        console.log(data);
        constr_grille(data);
        $("#grille").fadeIn("slow");
    });

    $("#nav-menus").click(function() {
        $("#grille").fadeOut("slow", function() {
            $("#grille").empty();
            $.get("http://localhost:8080/menus", {}, (data) => {
                console.log(data);
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