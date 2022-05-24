//Affiche les instructions de lancement du serveur si les arguments nécessaires ne sont pas renseignés
if(process.argv.length < 4){
    console.log("Erreur nombre d'arguments, utilisez: ");
    console.log("\tnode main.js [psql user] [database password] [optional: database name]");
    process.exit(1);
}

const pg = require('pg');

let poolInfo = {
    user: process.argv[2],
    host: 'localhost',
    database: process.argv.length >= 5 ? process.argv[4] : 'bd-web',
    port: 5432
}

poolInfo.password = process.argv[3];

//Objet qui permet de se connecter à la base de données
const pool = new pg.Pool(poolInfo);


//La constante de prix d'ingrédients supplémentaires
const prix_ajout_ingredient = 1.5;


//Les fonctions suivantes permettent d'accéder ainsi qu'ajouter des données dans la base de données

//Renvoie la liste des ingrédients
async function getIngr() {
    const client = await pool.connect();
    let res = await client.query ("SELECT nom_ingr as nom, image_url FROM INGRS");
    client.release();

    return res.rows;
}

//Renvoie la liste des tailles des pizzas ainsi que leurs prix et des images pour les représenter
async function getTaille() {
    const client = await pool.connect();
    let res = await client.query("SELECT nom_taille as nom, prix, image_url FROM TAILLES_PIZZA");
    client.release();

    return res.rows;
}

//Renvoie les entrées avec leurs prix, images et sauces disponibles
async function getEntree() {
    const client = await pool.connect();
    let res = await client.query ("SELECT nom_entree, prix_entree, image_url FROM ENTREES");

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

//Renvoie les boissons avec leurs images et leurs tailles disponibles avec le prix associés
async function getBoisson() {
    const client = await pool.connect();
    let res = await client.query("SELECT nom_boisson, image_url FROM BOISSONS");

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

//Renvoie la liste des pizzas
async function getPizza() {
    const client = await pool.connect();

    let res = await client.query("SELECT nom_taille, prix FROM TAILLES_PIZZA");

    let taille = [];
    let taille_prix = [];

    for(let i = 0; i < res.rows.length; i++) {
        let elt = res.rows[i];
        taille.push(elt.nom_taille);
        taille_prix.push(elt.prix);
    }

    res = await client.query("SELECT * FROM PIZZAS");

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
                pizza[j].description += elt.nom_ingr + " x " + elt.quantite + ", ";
                pizza[j].nb_ingr += elt.quantite;
            }
        }
    }

    for(let i = 0; i < pizza.length; i++) {
        pizza[i].price = pizza[i].nb_ingr > 3 ? (pizza[i].nb_ingr - 3) * prix_ajout_ingredient : 0;
        pizza[i].ingredients = Array.from(pizza[i].ingredients);
        pizza[i].description = pizza[i].description.substring(0, pizza[i].description.length - 2);
    } 

    client.release();
    return pizza;    
}

//Renvoie les ingrédients d'une pizza
async function getIngr_Pizza(pizza) {
    const client = await pool.connect();

    let s = "SELECT nom_ingr, quantite FROM ASS_PIZZ_ING WHERE nom_pizza='" + pizza + "'";
    console.log(s);
    let res = await client.query("SELECT nom_ingr, quantite FROM ASS_PIZZ_ING WHERE nom_pizza='" + pizza + "'");

    let map = new Map();
    for(let i = 0; i < res.rows.length; i++) {
        let elt = res.rows[i];
        map.set(elt.nom_ingr, elt.quantite);
    }

    let rep = Array.from(map);
    client.release();
    
    return rep;
}

//Constructeur d'un objet Entree
function Entree(nom, imageURL, prix) {
    this.nom = nom;
    this.choices = ["Aucune sauce"];//les sauces disponibles
    this.imageURL = imageURL;
    this.price = prix;
    this.prices_choices = [0];//les prix de chaque sauces
    this.description = "";
}

//Constructeur d'un objet Pizza
function Pizza(nom, taille, taille_prix, imageURL) {
    this.nom = nom;
    this.ingredients = new Map();//sert à associer une quantité à chaque ingrédient de la pizza
    this.choices = taille;
    this.imageURL = imageURL;
    this.price = 0
    this.nb_ingr = 0;
    this.prices_choices = taille_prix;
    this.description = "";

}

//Constructeur d'un objet Boisson
function Boisson(nom, image_url) {
    this.nom = nom;
    this.price = 0;
    this.choices = [];//les tailles disponibles
    this.prices_choices = [];//les prix de chaque taille
    this.imageURL = image_url;
    this.description = "";
}

//Construis le texte de description d'un menu dans l'attribut description de l'objet menu
function getMenuDescr(menu) {
    menu.description = menu.nb_entree + " entrée(s) , " + menu.nb_pizza + " pizza(s), " + menu.nb_boisson + " boisson(s)<br>";
    menu.description += "Taille Pizza : ";
    for(let i = 0; i < menu.tailles_pizza.length; i++) {
        menu.description += menu.tailles_pizza[i];
        if(i < menu.tailles_pizza.length - 1) menu.description += ", ";
    }
    menu.description += "<br>Taille Boisson : ";
    for(let i = 0; i < menu.tailles_boisson.length; i++) {
        menu.description += menu.tailles_boisson[i];
        if(i < menu.tailles_boisson.length - 1) menu.description += ", ";
    }
}

//Constructeur d'un objet Menu qui représente un format de menu
function Menu(nom,nb_entree, nb_pizza, nb_boisson, image, prix) {
    this.nom = nom;
    this.nb_entree = nb_entree;
    this.tailles_pizza = [];//Les tailles de pizza disponibles pour ce menu
    this.nb_pizza = nb_pizza;
    this.tailles_boisson = [];//Les tailles de boisson disponibles pour ce menu
    this.nb_boisson = nb_boisson;
    this.imageURL = image;
    this.price = prix;
    this.description = "";
}


//Génère un objet menu depuis la base de données
async function genMenu() {
    let menus = [];

    const client = await pool.connect();

    let res = await client.query("SELECT * FROM MENUS");
    for(let i = 0; i < res.rows.length; i++) {
        let elt = res.rows[i];
        menus.push(new Menu(elt.nom_menu, elt.nb_entree, elt.nb_pizza, elt.nb_boisson, elt.image_url, elt.prix));
    }

    res = await client.query("SELECT * FROM ASS_TAILLE_PIZZA_MENU");
    for(let i = 0; i < res.rows.length; i++) {
        let elt = res.rows[i];
        for(let j = 0; j < menus.length; j++) {
            if(elt.nom_menu == menus[j].nom) {
                menus[j].tailles_pizza.push(elt.nom_taille);
                break;
            }
        }
    }

    res = await client.query("SELECT * FROM ASS_TAILLE_BOI_MENU");
    for(let i = 0; i < res.rows.length; i++) {
        let elt = res.rows[i];
        for(let j = 0; j < menus.length; j++) {
            if(elt.nom_menu == menus[j].nom) {
                menus[j].tailles_boisson.push(elt.nom_taille);
                break;
            }
        }
    }

    for(let i = 0; i < menus.length; i++) {
        getMenuDescr(menus[i]);
    }

    client.release();

    return menus;
}

//Renvoie un id pour un nouvel élément à ajouter dans une table
async function getID(client, table) {
    let res = await client.query("SELECT MAX(id) + 1 as num FROM " + table);
 
    if(res.rows[0].num === null) res.rows[0].num = 0;
    return res.rows[0].num;
}

//Insère une commande dans la base de données
async function insertComm(client, id, nom, prenom, addr, code, num, email, heure) {
    let str = "";
    for(let i = 0; i < num.length; i++) {
        if(num[i] !== ' ') {
            str += num[i];
        }
    }
    num = str;
    if(code === undefined) code = "NULL";
    let res = await client.query("INSERT INTO commande VALUES (" + id + ",'" + nom + "','" + prenom + "','" + addr + "','" + code + "','" + num + "','" + email + "','" + heure + "',FALSE,FALSE)");
    console.log("INSERT INTO commande VALUES (" + id + ",'" + nom + "','" + prenom + "','" + addr + "','" + code + "','" + num + "','" + email + "','" + heure + "',FALSE,FALSE)");
}

//Insère un nouveau groupe dans la base de données et renvoie son id
//Un groupe est un groupe d'éléments d'une commande, c'est soit une commande entière, soit un menu
async function create_group(client, id, menu) {
    let id_groupe = await getID(client, "groupe");
    if(menu) await client.query("INSERT INTO groupe VALUES (" + id_groupe + ",NULL," + id + ")");
    else await client.query("INSERT INTO groupe VALUES (" + id_groupe + "," + id + ",NULL)");
    return id_groupe;
}

//Insère un élément dans un groupe dans la base de données
async function insert_elt(client, obj, groupe) {
    if(obj.type === 'boissons') {
        await client.query("INSERT INTO contient_boisson VALUES (" + groupe + ",'" + obj.name + "','" + obj.choice + "'," + obj.number + ")");
    } else if(obj.type === 'entrees') {
        await client.query("INSERT INTO contient_entree VALUES (" + groupe + ",'" + obj.name + "','" + obj.choice + "'," + obj.number + ")");
    } else {
        let id = await getID(client, "pizza");
        console.log("INSERT INTO pizza VALUES (" + id + ",'" + obj.name + "')");
        await client.query("INSERT INTO pizza VALUES (" + id + ",'" + obj.name + "')");
        //Etape 4 pour les pizza perso inserer la pizza perso get le num et inserer chaque ingrédient (voire fonction storeCommand)
        if(obj.name === 'Pizza Personnalisée') {
            let str = "";
            for(let i = 0; i < obj.choice.length; i++) {
                if(obj.choice[i] === '+') {
                    break;
                }
                str += obj.choice[i];
            }
            obj.choice = str.substring(0, str.length - 1);
            for(let i = 0; i < obj.ingr.length; i++) {
                let tab = obj.ingr[i];
                await client.query("INSERT INTO pizza_ingredient VALUES (" + id + ",'" + tab[0] + "'," + tab[1] + ")");
            }
        }
        console.log("INSERT INTO contient_pizza VALUES (" + groupe + "," + id + ",'" + obj.choice + "'," + obj.number + ")");
        await client.query("INSERT INTO contient_pizza VALUES (" + groupe + "," + id + ",'" + obj.choice + "'," + obj.number + ")");
    }
}

//Insère une commande et son contenu dans la base de données
async function storeCommande(req) {

    //Etape 1 Inserer la commande (get le num de la commande et la mettre)
    const client = await pool.connect();
    
    let num_comm = await getID(client, "commande");
    await insertComm(client, num_comm, req.nom, req.prenom, req.addr, req.code, req.num, req.email, req.time);

    //Etape 2 Creer le groupe de la commande et get le num
    let groupe_comm_id = await create_group(client, num_comm, false);

    for(let obj of req.panier) {
        if(obj.menu === 'true') {
            console.log("C'est un menu !");
            //Etape 5 pour les menu :
                // Creer le groupe menu et inserer comme pour les autres 
            let menu_id = await getID(client, "menu");
            await client.query("INSERT INTO menu VALUES (" + menu_id + ",'" + obj.name + "')");
            await client.query("INSERT INTO contient_menu VALUES (" + num_comm + "," + menu_id + ")");
            let groupe_id = await create_group(client, menu_id, true);

            for(let menu_obj of obj.elts) {
                console.log("On va inserer l'élément du menu");
                await insert_elt(client, menu_obj, groupe_id);
            }

        } else {
            //Etape 3 pour les boissons et entrees facile et Pizza non perso !
            console.log("On va inserer l'élément de la commande");
            await insert_elt(client, obj, groupe_comm_id);
        }
    }   

    client.release();

}

//Renvoie l'id d'un groupe représentant un menu ou une commande
async function get_groupe(client, id, menu) {
    if(menu) {
        let res = await client.query("select id FROM groupe WHERE menu=" + id);
        return res.rows[0].id;
    } else {
        let res = await client.query("select id FROM groupe WHERE commande=" + id);
        return res.rows[0].id;   
    }

}

//Ajoute tous les éléments d'un groupe dans le panier
async function add_elt_in_panier(client, panier, id_groupe) {
    //Ajoute les entrées
    console.log("SELECT * FROM contient_entree WHERE groupe=" + id_groupe);
    let res = await client.query("SELECT * FROM contient_entree WHERE groupe=" + id_groupe);
    for(let i = 0; i < res.rows.length; i++) {
        let r = res.rows[i];
        let o = {
            name: r.nom_entree,
            choice: r.sauce,
            number: r.nombre,
            type: 'entrees'
        }
        
        if(r.sauce !== "Aucune sauce") {
            let r_prix = await client.query("select prix_sauce + prix_entree as prix from entrees natural join ass_ent_sau natural join sauces where nom_entree='" + o.name + "' AND nom_sauce='" + o.choice + "'");
            o.price = r_prix.rows[0].prix;
        } else {
            let r_prix = await client.query("select prix_entree as prix from entrees where nom_entree='" + o.name + "'");
            o.price = r_prix.rows[0].prix;
        }

        panier.push(o);
    }

    //Ajoute les boissons
    res = await client.query("SELECT * FROM contient_boisson WHERE groupe=" + id_groupe);
    for(let i = 0; i < res.rows.length; i++) {
        let r = res.rows[i];
        let o = {
            name: r.nom_boisson,
            choice: r.taille,
            number: r.nombre,
            type: 'boissons'
        }
        
        let r_prix = await client.query("select prix from boissons natural join boi_tai_pri where nom_boisson='" + o.name + "' AND taille='" + o.choice + "'");
        o.price = r_prix.rows[0].prix;

        panier.push(o);
    }

    //Ajoute les pizzas
    res = await client.query("SELECT * FROM contient_pizza WHERE groupe=" + id_groupe);
    for(let i = 0; i < res.rows.length; i++) {
        let r = res.rows[i];

        let res2 = await client.query("SELECT * FROM pizza WHERE id=" + r.pizza);

        let o = {
            name: res2.rows[0].nom,
            choice: r.taille,
            number: r.nombre,
            type: 'pizzas'
        }
        
        let r_prix_taille = await client.query("select prix from tailles_pizza where nom_taille='" + o.choice + "'");
        let prix_taille = r_prix_taille.rows[0].prix;

        if(o.name === 'Pizza Personnalisée') {
            let ingr = [];
            let nb_ingr = 0;
            let res3 = await client.query("SELECT * FROM pizza_ingredient WHERE pizza=" + r.pizza);
            for(let j = 0; j < res3.rows.length; j++) {
                let r3 = res3.rows[j];
                ingr.push([r3.ingredient, r3.nombre]);
                nb_ingr += r3.nombre;
                o.choice += (j===0 ? " + ": ", ")+r3.nombre+" "+r3.ingredient;
            }

            o.ingr = ingr;
            o.price = prix_taille + (nb_ingr <= 3 ? 0 : (nb_ingr - 3) * prix_ajout_ingredient);
        } else {
            let res_prix = await client.query("SELECT SUM(quantite) as nb FROM ASS_PIZZ_ING WHERE nom_pizza='" + o.name + "' GROUP BY nom_pizza");
            let nb_ingr = res_prix.rows[0].nb;
            o.price = prix_taille + (nb_ingr <= 3 ? 0 : (nb_ingr - 3) * prix_ajout_ingredient);
        }

        panier.push(o);
    }
}

//Ajoute tous les menus d'une commande au panier
async function add_elt_menu(client, panier, id_commande) {
    let res = await client.query("select * from contient_menu where commande=" + id_commande);
    for(let i = 0; i < res.rows.length; i++) {
        let r = res.rows[i];

        let res2 = await client.query("select * from menu where id=" + r.menu);
        let r2 = res2.rows[0];

        let o = {
            name: r2.nom,
            type: 'menus',
            menu: true,
            number: 1,
        }

        let r_prix = await client.query("select prix from menus where nom_menu='" + o.name + "'");
        o.price = r_prix.rows[0].prix;

        let id_groupe = await get_groupe(client, r.menu, true);

        let elts = [];

        await add_elt_in_panier(client, elts, id_groupe);
        o.elts = elts;

        panier.push(o);

    } 
}

//Renvoie la première commande à livrer
async function getCommande() {
    let panier = [];
    let o;
    const client = await pool.connect();

    //sélectionne la commande avec l'heure de livraison la plus tôt, parmi celles qui n'ont pas été livrées et ne sont pas prises en charge par un autre livreur
    let res = await client.query("select * from commande where not livree and not prise_en_charge order by heure_livraison");
    if(res.rowCount !== 0) {
        let id_commande = res.rows[0].id;
        let r = res.rows[0];
        //initialise l'objet de la commande
        o = {
            id: id_commande,
            nom: r.nom,
            prenom: r.prenom,
            addr: r.adresse,
            code: r.code,
            num: r.numero_portable,
            email: r.email,
            heure: r.heure_livraison
        }
        
        //récupère l'id du groupe associé à la commande
        let id_groupe_comm = await get_groupe(client, id_commande, false);

        //ajoute les éléments et les menus de la commande au panier
        await add_elt_in_panier(client, panier, id_groupe_comm);
        await add_elt_menu(client, panier, id_commande);

        o.panier = panier;

        //cette commande est maintenant prise en charge
        await client.query("update commande set prise_en_charge = TRUE where id = "+id_commande);
    }

    client.release();
    return o;
}

//Change l'attribut livree d'une commande à TRUE
async function finishCommand(id){
    const client = await pool.connect();
    await client.query("update commande set livree = TRUE where id = "+id);
    client.release();
}

module.exports = {getPizza, getEntree, genMenu, getIngr, getTaille, getBoisson, getIngr_Pizza, storeCommande, getCommande, finishCommand};
