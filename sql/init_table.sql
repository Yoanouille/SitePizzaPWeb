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
    prix real,
    image_url varchar(100)
);

CREATE TABLE SAUCES(
    nom_sauce varchar(100) primary key,
    prix_sauce integer
);

CREATE TABLE ENTREES(
    nom_entree varchar(100) primary key,
    prix_entree real,
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
    prix real,
    primary key(nom_boisson, taille),
    FOREIGN KEY (nom_boisson) REFERENCES BOISSONS(nom_boisson)
);

CREATE TABLE MENUS (
    nom_menu varchar(100) primary key,
    image_url varchar(100),
    prix real,
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
('Moutarde', 1.15),
('Curry', 1.30),
('Barbecue', 1.10),
('Mayonnaise', 1.60),
('Ketchup', 1.09);

INSERT INTO ENTREES VALUES
('Chicken Wings', 5.5, 'images/entree/chicken.jpeg'),
('Breadsticks Mozzarella', 6, 'images/entree/breadsticks.jpg'),
('Potatoes', 4.89, 'images/entree/potatoes.jpg'),
('Frites', 4.35, 'images/entree/frites.webp'),
('Nuggets de Poulet', 5.6, 'images/entree/nuggets.webp'),
('Salade César', 4.12, 'images/entree/cesar.jpg'),
('Salade Méditéranéenne', 5.90, 'images/entree/méditeraneenne.jpg'),
('Salade Tomates Oignons Concombres', 3.90, 'images/entree/salade.JPG');

INSERT INTO ASS_ENT_SAU VALUES
('Chicken Wings', 'Ketchup'),
('Chicken Wings', 'Moutarde'),
('Chicken Wings', 'Curry'),
('Chicken Wings', 'Mayonnaise'),
('Chicken Wings', 'Barbecue'),
('Breadsticks Mozzarella', 'Ketchup'),
('Breadsticks Mozzarella', 'Barbecue'),
('Potatoes', 'Ketchup'),
('Potatoes', 'Moutarde'),
('Potatoes', 'Mayonnaise'),
('Potatoes', 'Barbecue'),
('Frites', 'Ketchup'),
('Frites', 'Moutarde'),
('Frites', 'Mayonnaise'),
('Frites', 'Barbecue'),
('Nuggets de Poulet', 'Ketchup'),
('Nuggets de Poulet', 'Moutarde'),
('Nuggets de Poulet', 'Mayonnaise'),
('Nuggets de Poulet', 'Barbecue'),
('Nuggets de Poulet', 'Curry');

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
('Coca Cola', 'images/boisson/coca.jpg'),
('Pepsi', 'images/boisson/pepsi.png'),
('Fanta', 'images/boisson/fanta.png'),
('Orangina', 'images/boisson/orangina.jpg'),
('Dr Pepper', 'images/boisson/drpepper.jpeg'),
('Oasis', 'images/boisson/oasis.jpg'),
('7 Up', 'images/boisson/7up.jpg'),
('Sprite', 'images/boisson/sprite.png'),
('Perrier', 'images/boisson/perrier.jpg'),
('Cristaline', 'images/boisson/cristaline.png');

INSERT INTO BOI_TAI_PRI VALUES
('Coca Cola', '25cL', 2),
('Coca Cola', '33cL', 3),
('Coca Cola', '1L', 9),
('Pepsi', '25cL', 2),
('Pepsi', '33cL', 3),
('Pepsi', '1L', 9),
('Fanta', '25cL', 3),
('Fanta', '33cL', 4),
('Fanta', '1L', 10),
('Orangina', '25cL', 3),
('Orangina', '33cL', 4),
('Orangina', '1L', 10),
('Dr Pepper', '25cL', 2),
('Dr Pepper', '33cL', 3),
('Dr Pepper', '1L', 9),
('Oasis', '25cL', 4),
('Oasis', '33cL', 6),
('Oasis', '1L', 11),
('7 Up', '25cL', 1.5),
('7 Up', '33cL', 2),
('7 Up', '1L', 6),
('Sprite', '25cL', 1.75),
('Sprite', '33cL', 3.25),
('Sprite', '1L', 6.85),
('Perrier', '25cL', 0.89),
('Perrier', '33cL', 1.25),
('Perrier', '1L', 3.21),
('Cristaline', '25cL', 0.5),
('Cristaline', '33cL', 0.75),
('Cristaline', '1L', 1);

INSERT INTO MENUS VALUES
('Small Menu', 'images/menu/menu1.jpg',25, 1, 1, 1),
('Medium Menu', 'images/menu/menu3.png',35, 2, 2, 2),
('Big Menu', 'images/menu/menu2.png',45, 3, 3, 3);

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





