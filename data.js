let prix_ajout_ingredient = 1.5;

const pg = require('pg');
const pool = new pg.Pool({
    user: 'alexandreleymarie',
    host: 'localhost',
    database: 'alexandreleymarie',
    port: 5432
});

async function getIngr() {
    const client = await pool.connect();
    let res = await client.query ("SELECT nom_ingr as nom, image_url FROM INGRS");
    client.release();
    console.log(res.rows);

    return res.rows;
}

async function getTaille() {
    const client = await pool.connect();
    let res = await client.query("SELECT nom_taille as nom, prix, image_url FROM TAILLES_PIZZA");
    client.release();
    
    console.log(res.rows);

    return res.rows;
}

async function getEntree() {
    const client = await pool.connect();
    let res = await client.query ("SELECT nom_entree, prix_entree, image_url FROM ENTREES");
    console.log(res.rows);

    let entree = [];
    for(let i = 0; i < res.rows.length; i++) {
        entree.push(new Entree(res.rows[i].nom_entree, res.rows[i].image_url, res.rows[i].prix_entree));
    }

    res = await client.query ("SELECT nom_entree, nom_sauce, prix_sauce FROM ASS_ENT_SAU NATURAL JOIN SAUCES");
    for(let i = 0; i < res.rows.length; i++) {
        let elt = res.rows[i];
        for(let j = 0; j < entree.length; j++) {
            if(entree[j].nom === elt.nom_entree) {
                entree[j].choices.push(elt.nom_sauce);
                entree[j].prices_choices.push(elt.prix_sauce);
                break;
            }
        }
    }
    client.release();

    return entree;
}


async function getBoisson() {
    const client = await pool.connect();
    let res = await client.query("SELECT nom_boisson, image_url FROM BOISSONS");
    console.log(res.rows);

    let boisson = [];
    for(let i = 0; i < res.rows.length; i++) {
        boisson.push(new Boisson(res.rows[i].nom_boisson, res.rows[i].image_url));
    }

    res = await client.query ("SELECT nom_boisson, taille, prix FROM BOI_TAI_PRI");
    for(let i = 0; i < res.rows.length; i++) {
        let elt = res.rows[i];
        for(let j = 0; j < boisson.length; j++) {
            if(boisson[j].nom === elt.nom_boisson) {
                boisson[j].choices.push(elt.taille);
                boisson[j].prices_choices.push(elt.prix);
                break;
            }
        }
    }

    client.release();
    return boisson;
}

async function getPizza() {
    const client = await pool.connect();

    let res = await client.query("SELECT nom_taille, prix FROM TAILLES_PIZZA");
    console.log(res.rows);

    let taille = [];
    let taille_prix = [];

    for(let i = 0; i < res.rows.length; i++) {
        let elt = res.rows[i];
        taille.push(elt.nom_taille);
        taille_prix.push(elt.prix);
    }

    //await new Promise(r => setTimeout(r, 2000));

    res = await client.query("SELECT * FROM PIZZAS");
    console.log(res.rows);


    let pizza = [];
    for(let i = 0; i < res.rows.length; i++) {
        let elt = res.rows[i];
        pizza.push(new Pizza(elt.nom_pizza, taille, taille_prix,elt.image_url));
    } 

    res = await client.query("SELECT * FROM ASS_PIZZ_ING");

    for(let i = 0; i < res.rows.length; i++) {
        let elt = res.rows[i];
        for(let j = 0; j < pizza.length; j++) {
            if(elt.nom_pizza == pizza[j].nom) {
                pizza[j].ingredients.set(elt.nom_ingr, elt.quantite);
                pizza[j].nb_ingr += elt.quantite;
            } 
        }
    }

    for(let i = 0; i < pizza.length; i++) {
        pizza[i].price = pizza[i].nb_ingr > 3 ? (pizza[i].nb_ingr - 3) * prix_ajout_ingredient : 0;
        pizza[i].ingredients = Array.from(pizza[i].ingredients);
    } 

    client.release();
    console.log(pizza);
    return pizza;    
}

async function getIngr_Pizza(pizza) {
    const client = await pool.connect();

    let s = "SELECT nom_ingr, quantite FROM ASS_PIZZ_ING WHERE nom_pizza='" + pizza + "'";
    console.log(s);
    let res = await client.query("SELECT nom_ingr, quantite FROM ASS_PIZZ_ING WHERE nom_pizza='" + pizza + "'");
    console.log(res.rows);

    let map = new Map();
    for(let i = 0; i < res.rows.length; i++) {
        let elt = res.rows[i];
        map.set(elt.nom_ingr, elt.quantite);
    }

    let rep = Array.from(map);
    client.release();
    
    return rep;
}

function Entree(nom, imageURL, prix) {
    this.nom = nom;
    this.choices = ["Aucune"];
    this.imageURL = imageURL;
    this.price = prix;
    this.prices_choices = [0];
}


function Pizza(nom, taille, taille_prix, imageURL) {
    this.nom = nom;
    this.ingredients = new Map();
    this.choices = taille;
    this.imageURL = imageURL;
    this.price = 0
    this.nb_ingr = 0;
    this.prices_choices = taille_prix;

}

function Boisson(nom, image_url) {
    this.nom = nom;
    this.price = 0;
    this.choices = [];
    this.prices_choices = [];
    this.imageURL = image_url;
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

function genMenu() {
    let menus = [
        new Menu("Small Menu",1, ["Medium"], 1, ["25cL"], 1, 'images/menu.png', 30),
        new Menu("Medium Menu",2, ["Medium", "Large"], 2, ["25cL","33cL"], 2, 'images/Menu2.png', 45),
        new Menu("Big Menu",3, ["Medium", "Large", "XLarge"], 3, ["25cL","33cL","1L"], 3, 'images/menu.png', 60),
    ];
    return menus;
}

module.exports = {getPizza, getEntree, genMenu, getIngr, getTaille, getBoisson, getIngr_Pizza};