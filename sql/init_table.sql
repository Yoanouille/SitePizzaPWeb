DROP TABLE IF EXISTS INGRS;
DROP TABLE IF EXISTS TAILLES_PIZZA;
DROP TABLE IF EXISTS SAUCES;
DROP TABLE IF EXISTS ENTREES;
DROP TABLE IF EXISTS ASS_ENT_SAU;
DROP TABLE IF EXISTS PIZZAS;
DROP TABLE IF EXISTS ASS_PIZZ_ING;
DROP TABLE IF EXISTS BOISSONS;
DROP TABLE IF EXISTS BOI_TAI_PRI;

CREATE TABLE INGRS (
    nom_ingr varchar(100) primary key,
    image_url varchar(100)
);


CREATE TABLE TAILLES_PIZZA(
    nom_taille varchar(100) primary key,
    prix integer,
    image_url varchar(100)
);

CREATE TABLE SAUCES(
    nom_sauce varchar(100) primary key,
    prix integer
);

CREATE TABLE ENTREES(
    nom_entree varchar(100) primary key,
    prix integer,
    image_url varchar(100)
);

CREATE TABLE ASS_ENT_SAU(
    nom_entree varchar(100),
    nom_sauce varchar(100),
    primary key(nom_entree, nom_sauce),
    FOREIGN KEY (nom_entree) REFERENCES ENTREES(nom_entree),
    FOREIGN KEY (nom_sauce) REFERENCES SAUCES(nom_sauce)
);

CREATE TABLE PIZZAS(
    nom_pizza varchar(100) primary key,
    image_url varchar(100)
);

CREATE TABLE ASS_PIZZ_ING(
    nom_pizza varchar(100),
    nom_ingr varchar(100),
    primary key(nom_pizza, nom_ingr),
    FOREIGN KEY (nom_pizza) REFERENCES PIZZAS(nom_pizza),
    FOREIGN KEY (nom_ingr) REFERENCES INGRS(nom_ingr) 
);

CREATE TABLE BOISSONS(
    nom_boisson varchar(100) primary key,
    image_url varchar(100)
);

CREATE TABLE BOI_TAI_PRI(
    nom_boisson varchar(100),
    taille varchar(10),
    prix integer,
    primary key(nom_boisson, taille, prix),
    FOREIGN KEY (nom_boisson) REFERENCES BOISSONS(nom_boisson)
);

INSERT INTO INGRS VALUES
('Jambon','images/entree.png'),
('Bacon','images/entree.png'),
('Champignons','images/entree.png'),
('Ognions','images/entree.png'),
('Salades','images/entree.png'),
('Oeufs','images/entree.png');

INSERT INTO TAILLES_PIZZA VALUES
('Medium', 20, 'images/test.png'),
('Large', 30, 'images/large.png'),
('XLarge', 40, 'images/Xlarge.png');
