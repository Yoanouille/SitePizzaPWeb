let prix_ajout_ingredient = 1.5;

const pg = require('pg');
const pool = new pg.Pool({
    user: 'alexandreleymarie',
    host: 'localhost',
    database: 'bd-web',
    password: 'yoyo',
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
    this.choices = ["Aucune sauce"];
    this.imageURL = imageURL;
    this.price = prix;
    this.prices_choices = [0];
    this.description = "";
}


function Pizza(nom, taille, taille_prix, imageURL) {
    this.nom = nom;
    this.ingredients = new Map();
    this.choices = taille;
    this.imageURL = imageURL;
    this.price = 0
    this.nb_ingr = 0;
    this.prices_choices = taille_prix;
    this.description = "";

}

function Boisson(nom, image_url) {
    this.nom = nom;
    this.price = 0;
    this.choices = [];
    this.prices_choices = [];
    this.imageURL = image_url;
    this.description = "";
}


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

function Menu(nom,nb_entree, nb_pizza, nb_boisson, image, prix) {
    this.nom = nom;
    this.nb_entree = nb_entree;
    this.tailles_pizza = [];
    this.nb_pizza = nb_pizza;
    this.tailles_boisson = [];
    this.nb_boisson = nb_boisson;
    this.imageURL = image;
    this.price = prix;
    this.description = "";
}



async function genMenu() {
    let menus = [];

    const client = await pool.connect();

    let res = await client.query("SELECT * FROM MENUS");
    console.log(res.rows);
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

    console.log(menus);
    return menus;
}

async function getID(client, table) {
    //console.log("SELECT MAX(id) + 1 as num FROM " + table);
    let res = await client.query("SELECT MAX(id) + 1 as num FROM " + table);
 
    //console.log("ID " + table + " : " + res.rows[0].num);
    if(res.rows[0].num === null) res.rows[0].num = 0;
    return res.rows[0].num;
}

// id integer primary key, 
//     nom varchar(100),
//     prenom varchar(100),
//     adresse varchar(100),
//     code varchar(100),
//     numero_portable char(10),
//     email varchar(100),
//     heure_livraison time

async function insertComm(client, id, nom, prenom, addr, code, num, email, heure) {
    let str = "";
    for(let i = 0; i < num.length; i++) {
        if(num[i] !== ' ') {
            str += num[i];
        }
    }
    num = str;
    if(code === undefined) code = "NULL";
    console.log(num);
    let res = await client.query("INSERT INTO commande VALUES (" + id + ",'" + nom + "','" + prenom + "','" + addr + "','" + code + "','" + num + "','" + email + "','" + heure + "',FALSE)");
    console.log("INSERT INTO commande VALUES (" + id + ",'" + nom + "','" + prenom + "','" + addr + "','" + code + "','" + num + "','" + email + "','" + heure + "',FALSE)");
}

async function create_group(client, id, menu) {
    let id_groupe = await getID(client, "groupe");
    if(menu) await client.query("INSERT INTO groupe VALUES (" + id_groupe + ",NULL," + id + ")");
    else await client.query("INSERT INTO groupe VALUES (" + id_groupe + "," + id + ",NULL)");
    return id_groupe;
}

async function insert_elt(client, obj, groupe) {
    if(obj.type === 'boissons') {
        await client.query("INSERT INTO contient_boisson VALUES (" + groupe + ",'" + obj.name + "','" + obj.choice + "'," + obj.number + ")");
    } else if(obj.type === 'entrees') {
        await client.query("INSERT INTO contient_entree VALUES (" + groupe + ",'" + obj.name + "','" + obj.choice + "'," + obj.number + ")");
    } else {
        let id = await getID(client, "pizza");
        console.log("INSERT INTO pizza VALUES (" + id + ",'" + obj.name + "')");
        await client.query("INSERT INTO pizza VALUES (" + id + ",'" + obj.name + "')");
        //Etape 4 pour les pizza perso inserer la pizza perso get le num et inserer chaque ingrédient
        if(obj.name === 'Pizza Personnalisée') {
            let str = "";
            for(let i = 0; i < obj.choice.length; i++) {
                if(obj.choice[i] === '+') {
                    break;
                }
                str += obj.choice[i];
            }
            obj.choice = str.substring(0, str.length - 1);
            console.log(obj.choice);
            for(let i = 0; i < obj.ingr.length; i++) {
                let tab = obj.ingr[i];
                await client.query("INSERT INTO pizza_ingredient VALUES (" + id + ",'" + tab[0] + "'," + tab[1] + ")");
            }
        }
        console.log("INSERT INTO contient_pizza VALUES (" + groupe + "," + id + ",'" + obj.choice + "'," + obj.number + ")");
        await client.query("INSERT INTO contient_pizza VALUES (" + groupe + "," + id + ",'" + obj.choice + "'," + obj.number + ")");
    }
}

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


async function get_groupe(client, id, menu) {
    if(menu) {
        let res = await client.query("select id FROM groupe WHERE menu=" + id);
        return res.rows[0].id;
    } else {
        let res = await client.query("select id FROM groupe WHERE commande=" + id);
        return res.rows[0].id;   
    }

}

async function add_elt_in_panier(client, panier, id_groupe) {
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

async function add_elt_menu(client, panier, id_commande) {
    let res = await client.query("select * from contient_menu where commande=" + id_commande);
    console.log(res.rows);
    for(let i = 0; i < res.rows.length; i++) {
        let r = res.rows[i];

        let res2 = await client.query("select * from menu where id=" + r.menu);
        let r2 = res2.rows[0];

        let o = {
            name: r2.nom,
            type: 'menus',
            number: 1,
        }

        let r_prix = await client.query("select prix from menus where nom_menu='" + o.name + "'");
        o.price = r_prix.rows[0].prix;

        let id_groupe = await get_groupe(client, r.menu, true);
        console.log("ID MENU_GROUPE : " + id_groupe);

        let elts = [];

        await add_elt_in_panier(client, elts, id_groupe);
        o.elts = elts;
        console.log(elts);

        panier.push(o);

    } 
}

async function getCommande() {
    let panier = [];
    let o;
    const client = await pool.connect();

    let res = await client.query("select * from commande where not livree order by heure_livraison");
    if(res.rowCount !== 0) {
        let id_commande = res.rows[0].id;
        let r = res.rows[0];
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
        
        let id_groupe_comm = await get_groupe(client, id_commande, false);

        await add_elt_in_panier(client, panier, id_groupe_comm);
        await add_elt_menu(client, panier, id_commande);

        o.panier = panier;

    }
    
    client.release();
    return o;
}

async function finishCommand(id){
    console.log("id: "+id);
    const client = await pool.connect();
    await client.query("update commande set livree = TRUE where id = "+id);
    client.release();
}

getCommande();

module.exports = {getPizza, getEntree, genMenu, getIngr, getTaille, getBoisson, getIngr_Pizza, storeCommande, getCommande, finishCommand};
