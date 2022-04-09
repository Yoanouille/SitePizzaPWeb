const data = require('./data');

const express = require('express');
const server = express();
const port = 8080;

server.use(express.static('public'));
server.use(express.json());

server.get('/', (req, res) => {
    res.sendFile("page.html", {root: 'public'});
});

server.get('/menus', (req, res) => {
    res.json({content: data.genMenu()});
});

server.get('/entree', (req, res) => {
    res.json({prix_choices: data.prix_sauces, content:data.genEntree()});
});

server.get('/boisson', (req, res) => {
    res.json({choices: data.tailles_boisson, prix_choices: data.prix_tailles_boisson, content:data.genBoisson()});
});

server.get('/pizza', (req, res) => {
    res.json({choices: data.tailles_pizza, prix_choices: data.prix_tailles_pizza, content:data.genPizza()});
});

server.listen(port, function() {
    console.log("Running");
});
