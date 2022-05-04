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
    heure_livraison time
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
    nombre integer,
    PRIMARY KEY (groupe, pizza),
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


-- tests
insert into commande values
(0,'LEYMARIE','Alexandre','adresse',NULL,'0768935759','alexandre.j.leymarie@gmail.com','20:30');

insert into menu values
(0, 'BIG MENU');

insert into groupe values
(0, 0, NULL),
(1, NULL, 0);

insert into contient_entree values
(0, 'Salade1', 'Aucune sauce', 1),
(1, 'Salade2', 'Aucune sauce', 1);

insert into pizza values
(0, 'pepperoni pizza');

insert into pizza_ingredient values
(0, 'pepperoni', 1);

insert into contient_pizza values
(1, 0, 1);

insert into contient_menu values
(0, 0);

select * from pizza where id = (select pizza from contient_pizza join groupe on groupe.id=contient_pizza.groupe where menu = 0);
