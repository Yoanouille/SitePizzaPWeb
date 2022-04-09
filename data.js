function Entree(nom, sauces, imageURL, prix) {
    this.nom = nom;
    this.sauces = sauces;
    this.imageURL = imageURL;
    this.prix = prix;
}


function Pizza(nom, ingredients, imageURL) {
    this.nom = nom;
    this.ingredients = ingredients;
    this.imageURL = imageURL;

}

function Boisson(nom, prix, taille_dispo) {
    this.nom = nom;
    this.prix = prix;
    this.taille_dispo = taille_dispo;
}

function Menu(nom,nb_entree, tailles_pizza, nb_pizza, tailles_boisson, nb_boisson, image) {
    this.nom = nom;
    this.nb_entree = nb_entree;
    this.tailles_pizza = tailles_pizza;
    this.nb_pizza = nb_pizza;
    this.tailles_boisson = tailles_boisson;
    this.nb_boisson = nb_boisson;
    this.imageURL = image;
}

let prix_sauces = 2;
let prix_ajout_ingredient = 1.5;


let tailles_pizza = ["Medium", "Large", "XLarge"];
let prix_tailles_pizza  = [20, 30, 40];

let tailles_boisson = ["25cL", "33cL", "1L", "2L"];
let prix_tailles_boisson = [2, 3, 9, 15];

let ingredients = ["Jambon", "Bacon","Champignons", "Ognions", "Salades", "Oeufs"];

function genEntree() {
    let entrees = [];
    for(let i = 0; i < 15; i++) {
        entrees.push(new Entree("Entree " + i, ["Ketchup", "Moutarde"], 'entree.png', 10));
    }
    return entrees;
}

function genPizza() {
    let pizzas = [];
    for(let i = 0; i < 12; i++) {
        pizzas.push(new Pizza("Pizza " + i, ["Jambon", "Champignons"], 'pizza2.jpeg'));
    }
    return pizzas;
}

function genBoisson() {
    let boissons = [];
    for(let i = 0; i < 6; i++) {
        boissons.push(new Boisson("Coca Cola " + i, 5, ["25cL", "33cL"]));
    }
    return boissons;
}

function genMenu() {
    let menus = [
        new Menu("Small Menu",1, ["Medium"], 1, ["25cL"], 1, 'menu.png'),
        new Menu("Medium Menu",2, ["Medium", "Large"], 2, ["25cL","33cL"], 2, 'menu.png'),
        new Menu("Big Menu",3, ["Medium", "Large", "XLarge"], 3, ["25cL","33cL","1L"], 3, 'menu.png'),
    ];
    return menus;
}

module.exports = {tailles_pizza, prix_tailles_pizza, tailles_boisson, prix_tailles_boisson, prix_sauces, prix_ajout_ingredient, ingredients, genEntree, genPizza, genBoisson, genMenu};