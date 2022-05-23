DROP TABLE IF EXISTS commande cascade;
DROP TABLE IF EXISTS menu cascade;
DROP TABLE IF EXISTS groupe cascade;
DROP TABLE IF EXISTS contient_menu cascade;
DROP TABLE IF EXISTS contient_entree cascade;
DROP TABLE IF EXISTS pizza cascade;
DROP TABLE IF EXISTS pizza_ingredient cascade;
DROP TABLE IF EXISTS contient_pizza cascade;
DROP TABLE IF EXISTS contient_boisson cascade;

CREATE TABLE commande (
    id integer primary key, 
    nom varchar(100),
    prenom varchar(100),
    adresse varchar(100),
    code varchar(100),
    numero_portable char(10),
    email varchar(100),
    heure_livraison time,
    livree boolean
);

CREATE TABLE menu (
    id integer primary key,
    nom varchar(100)
);

CREATE TABLE groupe (
    id integer primary key,
    commande integer,
    menu integer
);

CREATE TABLE contient_menu (
    commande integer,
    menu integer,
    PRIMARY KEY (commande, menu),
    FOREIGN KEY (commande) REFERENCES commande(id),
    FOREIGN KEY (menu) REFERENCES menu(id)
);

CREATE TABLE contient_entree (
    groupe integer,
    nom_entree varchar(100),
    sauce varchar(100),
    nombre integer,
    PRIMARY KEY (groupe, nom_entree, sauce),
    FOREIGN KEY (groupe) REFERENCES groupe(id)
);

CREATE TABLE pizza (
    id integer primary key,
    nom varchar(100)
);

CREATE TABLE pizza_ingredient (
    pizza integer,
    ingredient varchar(100),
    nombre integer,
    PRIMARY KEY (pizza, ingredient),
    FOREIGN KEY (pizza) REFERENCES pizza(id)
);

CREATE TABLE contient_pizza (
    groupe integer,
    pizza integer,
    taille varchar(100),
    nombre integer,
    PRIMARY KEY (groupe, pizza, taille),
    FOREIGN KEY (groupe) REFERENCES groupe(id),
    FOREIGN KEY (pizza) REFERENCES pizza(id)
);


CREATE TABLE contient_boisson (
    groupe integer,
    nom_boisson varchar(100),
    taille varchar(100),
    nombre integer,
    PRIMARY KEY (groupe, nom_boisson, taille),
    FOREIGN KEY (groupe) REFERENCES groupe(id)
);
