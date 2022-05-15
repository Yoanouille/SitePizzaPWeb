DROP TABLE IF EXISTS INGRS cascade;
DROP TABLE IF EXISTS TAILLES_PIZZA cascade;
DROP TABLE IF EXISTS SAUCES cascade;
DROP TABLE IF EXISTS ENTREES cascade;
DROP TABLE IF EXISTS ASS_ENT_SAU cascade;
DROP TABLE IF EXISTS PIZZAS cascade;
DROP TABLE IF EXISTS ASS_PIZZ_ING cascade;
DROP TABLE IF EXISTS BOISSONS cascade;
DROP TABLE IF EXISTS BOI_TAI_PRI cascade;
DROP TABLE IF EXISTS MENUS cascade;
DROP TABLE IF EXISTS ASS_TAILLE_BOI_MENU cascade;
DROP TABLE IF EXISTS ASS_TAILLE_PIZZA_MENU cascade;

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
    prix_sauce integer
);

CREATE TABLE ENTREES(
    nom_entree varchar(100) primary key,
    prix_entree integer,
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
    quantite integer,
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
    primary key(nom_boisson, taille),
    FOREIGN KEY (nom_boisson) REFERENCES BOISSONS(nom_boisson)
);

CREATE TABLE MENUS (
    nom_menu varchar(100) primary key,
    image_url varchar(100),
    prix integer,
    nb_entree integer,
    nb_pizza integer,
    nb_boisson integer
);

CREATE TABLE ASS_TAILLE_PIZZA_MENU (
    nom_menu varchar(100),
    nom_taille varchar(100),
    primary key (nom_menu, nom_taille),
    FOREIGN KEY (nom_menu) REFERENCES MENUS(nom_menu),
    FOREIGN KEY (nom_taille) REFERENCES TAILLES_PIZZA(nom_taille)
);

CREATE TABLE ASS_TAILLE_BOI_MENU (
    nom_menu varchar(100),
    nom_taille varchar(100),
    primary key (nom_menu, nom_taille),
    FOREIGN KEY (nom_menu) REFERENCES MENUS(nom_menu)
);



INSERT INTO INGRS VALUES
('Jambon','images/ingr/jambons.png'),
('Mozzarella','images/ingr/mozzarella.png'),
('Champignon','images/ingr/champignons.webp'),
('Pepperoni', 'images/ingr/pepperoni.png'),
('Oignon','images/ingr/oignon.png'),
('Salade','images/ingr/salade.png'),
('Oeuf','images/ingr/oeuf.png'),
('Olive','images/ingr/olive.png'),
('Basilic','images/ingr/basilic.jpg'),
('Huile','images/ingr/huile.png'),
('Lardon','images/ingr/lardons.png'),
('Poulet','images/ingr/poulet.png');

INSERT INTO TAILLES_PIZZA VALUES
('Medium', 20, 'images/pizza/Medium.jpg'),
('Large', 30, 'images/pizza/Large.jpg'),
('XLarge', 40, 'images/pizza/Xlarge.jpg');

INSERT INTO SAUCES VALUES
('Moutarde', 2),
('Ketchup', 2);

INSERT INTO ENTREES VALUES
('Entrée 1', 5, 'images/entree2.JPG'),
('Entrée 2', 6, 'images/entree2.JPG'),
('Entrée 3', 5, 'images/entree2.JPG'),
('Entrée 4', 7, 'images/entree2.JPG'),
('Entrée 5', 3, 'images/entree2.JPG'),
('Entrée 6', 3, 'images/entree2.JPG'),
('Entrée 7', 1, 'images/entree2.JPG');

INSERT INTO ASS_ENT_SAU VALUES
('Entrée 1', 'Ketchup'),
('Entrée 1', 'Moutarde'),
('Entrée 4', 'Ketchup'),
('Entrée 6', 'Moutarde');

INSERT INTO PIZZAS VALUES
('Pizza Regina', 'images/pizza/regina.jpg'),
('Pizza Max Pepperoni', 'images/pizza/max_pepperoni.webp'),
('Pizza Méditéraneenne', 'images/pizza/poulet-oignons.jpeg');

INSERT INTO ASS_PIZZ_ING VALUES
('Pizza Regina', 'Jambon', 3),
('Pizza Regina', 'Champignon', 3),
('Pizza Max Pepperoni', 'Pepperoni', 6),
('Pizza Méditéraneenne', 'Poulet', 3),
('Pizza Méditéraneenne', 'Oignon', 3),
('Pizza Méditéraneenne', 'Olive', 3);

INSERT INTO BOISSONS VALUES
('Boisson 1', 'images/boisson/coca.jpg'),
('Boisson 3', 'images/boisson/coca.jpg'),
('Boisson 2', 'images/boisson/coca.jpg'),
('Boisson 4', 'images/boisson/coca.jpg'),
('Boisson 5', 'images/boisson/boissons.png'),
('Boisson 12', 'images/boisson/boissons.png'),
('Boisson 23', 'images/boisson/boissons.png'),
('Boisson Je sais plus', 'images/boisson/boissons.png'),
('Boisson blabla', 'images/boisson/boissons.png');

INSERT INTO BOI_TAI_PRI VALUES
('Boisson 1', '33cL', 10),
('Boisson 1', '25cL', 7),
('Boisson 1', '17cL', 5),
('Boisson 1', '1mm', 1),
('Boisson 1', 'infini', 100),
('Boisson 2', '33cL', 10),
('Boisson 3', '33cL', 10),
('Boisson 5', '33cL', 10),
('Boisson 12', '33cL', 10),
('Boisson 23', '33cL', 10),
('Boisson Je sais plus', '33cL', 36),
('Boisson blabla', '33cL', 0);

INSERT INTO MENUS VALUES
('Small Menu', 'images/menu.png',30, 1, 1, 1),
('Medium Menu', 'images/Menu2.png',45, 2, 2, 2),
('Big Menu', 'images/menu.png',60, 3, 3, 3);

INSERT INTO ASS_TAILLE_PIZZA_MENU VALUES
('Small Menu', 'Medium'),
('Medium Menu', 'Medium'),
('Medium Menu', 'Large'),
('Big Menu', 'Medium'),
('Big Menu', 'Large'),
('Big Menu', 'XLarge');

INSERT INTO ASS_TAILLE_BOI_MENU VALUES
('Small Menu', '25cL'),
('Medium Menu', '25cL'),
('Medium Menu', '33cL'),
('Big Menu', '25cL'),
('Big Menu', '33cL'),
('Big Menu', '1L');





