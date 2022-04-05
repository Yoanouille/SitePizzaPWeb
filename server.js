const express = require('express');
const app = express();
const port = 8080;

server.use(express.static('public'));
server.use(express.json());

app.get('/', (req, res) => {
    
});

app.listen(port, function() {
    console.log("Running");
});


function getIngredients() {
    let ingr = [];
    for(let i = 0; i < 10; i++) {
        ingr.push(new Ingredient("ingrédient " + i, 800));
    }
    return ingr
}

function getPizza() {
    pizzas = [];
    for(let i = 0; i < 15; i++) {
        pizzas.push(new Pizza("Pizza " + i, "Un super Pizza (comme toutes les autre)", getIngredients(), "pizza2.jpeg"));
    }
    return pizzas;
}

function getSauces() {
    let sauces = [];
    for(let i = 0; i < 10; i++) {
        sauces.push(new Ingredient("Sauce " + i, 800));
    }
    return sauces
}

function getEntree() {
    let entrees = [];
    for(let i = 0; i < 10; i++) {
        entrees.push(new Entree("Entrée " + i, "Un entée banale, mais achetez là quand même", getSauces(), "entree.png"));
    }
    return entrees;
}

function getBoisson() {
    let boissons = [];
    for(let i = 0; i < 10; i++) {
        boissons.push(new Boisson("Boisson " + i, 45, "46cL"));
    }
    return boissons
}

function Entree(nom, descr, sauces, imageURL) {
    this.nom = nom;
    this.descr = descr;
    this.sauces = sauces;
    this.imageURL = imageURL;
    this.prix = prix;
}

function Ingredient(nom, prix) {
    this.nom = nom;
    this.prix = prix;
}

function Pizza(nom, descr, ingredients, imageURL) {
    this.nom = nom;
    this.descr = descr;
    this.ingredients = ingredients;
    this.imageURL = imageURL;

}

function Boisson(nom, prix, taille) {
    this.nom = nom;
    this.prix = prix;
    this.taille = taille;
}

function Menu(nb_entree, taille_pizza, taille_boisson) {
    this.nb_entree = nb_entree;
    this.taille_pizza = taille_pizza;
    this.taille_boisson = taille_boisson;
}