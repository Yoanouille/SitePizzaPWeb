const data = require('./data');

const express = require('express');
const server = express();
const port = 8080;

server.use(express.static('public'));
server.use(express.json());
server.use(express.urlencoded({extended: true}));

//Envoie la page principale
server.get('/', (req, res) => {
    res.sendFile("page.html", {root: 'public'});
});

//Envoie la page de livraison
server.get('/livraison', (req, res) => {
    res.sendFile("livraison.html", {root: 'public'});
});

//Quand le serveur reçoit une requête post sur la page livraison, il finit la commande demandée et renvoie la page de livraison
server.post('/livraison', (req, res) => {
    data.finishCommand(req.body.commandId);
    res.sendFile("livraison.html", {root: 'public'});
});

//Envoie une commande au client
server.get('/commande', (req, res) => {
    data.getCommande().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

//Envoie les menus depuis la base de données
server.get('/menus', (req, res) => {
    data.genMenu().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

//Envoie les entrées depuis la base de données
server.get('/entrees', (req, res) => {
    data.getEntree().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

//Envoie les boissons depuis la base de données
server.get('/boissons', (req, res) => {
    data.getBoisson().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

//Envoie les pizzas depuis la base de données
server.get('/pizzas', (req, res) => {
    data.getPizza().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

//Envoie les ingrédients depuis la base de données
server.get('/ingr', (req, res) => {
    data.getIngr().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

//Envoie les tailles des pizzas avec leurs prix depuis la base de données
server.get('/taille', (req, res) => {
    data.getTaille().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

//Envoie les ingrédients d'une pizza
server.get('/pizza-ingr', (req, res) => {
    console.log(req.query);
    data.getIngr_Pizza(req.query.pizza).then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

//Stocke la commande d'un utilisateur après avoir reçu une requête post sur la page principale
server.post('/', (req, res) => {
    data.storeCommande(req.body);
    res.sendFile("page.html", {root: 'public'});
});

//Lance le serveur
server.listen(port, function() {
    console.log("Running");
});
