let prix_sauces = 2;
let prix_ajout_ingredient = 1.5;


let tailles_pizza = ["Medium", "Large", "XLarge"];
let prix_tailles_pizza  = [20, 30, 40];

let tailles_boisson = ["25cL", "33cL", "1L", "2L"];
let prix_tailles_boisson = [2, 3, 9, 15];

let ingredients = ["Jambon", "Bacon","Champignons", "Ognions", "Salades", "Oeufs"];

function getPrixTaille(taille_dispo, tailles_prix, tailles) {
    let prix = [];
    for(let i = 0; i < taille_dispo.length; i++) {
        for(let j = 0; j < tailles.length; j++) {
            if(taille_dispo[i] == tailles[j]) {
                prix.push(tailles_prix[j]);
                break;
            }
        }
    }
    return prix;
}

function getPrixSauces(sauces) {
    let prix = [0];
    for(let i = 0; i < sauces.length; i++) {
        prix.push(prix_sauces);
    }
    return prix;
}

function descrPizza(pizza) {
    let res = "";
    for(let i = 0; i < pizza.ingredients.length; i++) {
        res +=  pizza.ingredients[i] + " ";
    }
    return res;
}

function descrMenu(menu) {
    res = menu.nb_entree + " " +
          menu.nb_pizza  + " " +
          menu.nb_boisson + " ";
    return res;
}
 
function Element(nom, choices, price, price_choices, image) {
    this.nom = nom;
    this.choices = choices;
    this.price = price;
    this.prices_choices = price_choices;
    this.imageURL = image;
}

function Entree(nom, sauces, imageURL, prix) {
    this.nom = nom;
    this.choices = sauces;
    this.imageURL = imageURL;
    this.price = prix;
    this.prices_choices = getPrixSauces(sauces);
}


function Pizza(nom, ingredients, imageURL) {
    this.nom = nom;
    this.ingredients = ingredients;
    this.choices = tailles_pizza;
    this.imageURL = imageURL;
    this.price = ingredients.length >= 3 ? prix_ajout_ingredient * (ingredients.length - 3) : 0;
    this.prices_choices = prix_tailles_pizza;

}

function Boisson(nom, prix, taille_dispo, image) {
    this.nom = nom;
    this.price = prix;
    this.choices = taille_dispo
    this.prices_choices = getPrixTaille(taille_dispo, prix_tailles_boisson, tailles_boisson);
    this.imageURL = image;

}

function Menu(nom,nb_entree, tailles_pizza, nb_pizza, tailles_boisson, nb_boisson, image, prix) {
    this.nom = nom;
    this.nb_entree = nb_entree;
    this.tailles_pizza = tailles_pizza;
    this.nb_pizza = nb_pizza;
    this.tailles_boisson = tailles_boisson;
    this.nb_boisson = nb_boisson;
    this.imageURL = image;
    this.price = prix;
}

function genEntree() {
    let entrees = [];
    for(let i = 0; i < 15; i++) {
        entrees.push(new Entree("Entree " + i, ["Aucune", "Ketchup", "Moutarde"],'entree2.JPG',10));
    }
    return entrees;
}

function genPizza() {
    let pizzas = [];
    for(let i = 0; i < 12; i++) {
        if(i != 5) pizzas.push(new Pizza("Pizza " + i, ["Jambon", "Champignons"], 'pizza2.jpeg'));
        else pizzas.push(new Pizza("Pizza Special", ["Jambon", "Champignons", "Oeufs", "Ognions", "Bacon", "Salades"], 'pizza.png'));
    }
    return pizzas;
}

function genBoisson() {
    let boissons = [];
    for(let i = 0; i < 6; i++) {
        if(i != 4) boissons.push(new Boisson("Coca Cola " + i, 5, ["25cL", "33cL"], 'coca.jpg'));
        else boissons.push(new Boisson("Boisson Special", 5, ["33cL"], 'boissons.png'));
    }
    return boissons;
}

function genMenu() {
    let menus = [
        new Menu("Small Menu",1, ["Medium"], 1, ["25cL"], 1, 'menu.png', 30),
        new Menu("Medium Menu",2, ["Medium", "Large"], 2, ["25cL","33cL"], 2, 'Menu2.png', 45),
        new Menu("Big Menu",3, ["Medium", "Large", "XLarge"], 3, ["25cL","33cL","1L"], 3, 'menu.png', 60),
    ];
    return menus;
}

module.exports = {genEntree, genPizza, genBoisson, genMenu};