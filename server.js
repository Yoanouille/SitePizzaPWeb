const data = require('./data');

data.getIngr();

const express = require('express');
const server = express();
const port = 8080;

server.use(express.static('public'));
server.use(express.json());
server.use(express.urlencoded({extended: true}));


server.get('/', (req, res) => {
    res.sendFile("page.html", {root: 'public'});
});

server.get('/menus', (req, res) => {
    res.json(data.genMenu());
});

server.get('/entrees', (req, res) => {
    data.getEntree().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

server.get('/boissons', (req, res) => {
    data.getBoisson().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

server.get('/pizzas', (req, res) => {
    data.getPizza().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

server.get('/ingr', (req, res) => {
    data.getIngr().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

server.get('/taille', (req, res) => {
    data.getTaille().then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

server.get('/pizza-ingr', (req, res) => {
    console.log(req.query);
    data.getIngr_Pizza(req.query.pizza).then(resul => {res.json(resul);}).catch(err => console.log(err.stack));
});

server.post('/command', (req, res) => {
    console.log(req);
});

server.post('/', (req, res) => {
    console.log(req.body.test);

    res.sendFile("page.html", {root: 'public'});
});

server.listen(port, function() {
    console.log("Running");
});
