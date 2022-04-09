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
    res.json(data.genMenu());
});

server.get('/entrees', (req, res) => {
    res.json(data.genEntree());
});

server.get('/boissons', (req, res) => {
    res.json(data.genBoisson());
});

server.get('/pizzas', (req, res) => {
    res.json(data.genPizza());
});

server.listen(port, function() {
    console.log("Running");
});
