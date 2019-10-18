
//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var competenciasControlador = require('./controladores/competenciasControlador');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

// Pedidos

app.get('/competencias', competenciasControlador.obtenerCompetencias);
app.get('/competencias/:id/peliculas', competenciasControlador.obtenerOpciones);
app.post('/competencias/:id/voto', competenciasControlador.votar);
app.get('/competencias/:id/resultados', competenciasControlador.obtenerResultados);
app.post('/competencias', competenciasControlador.agregarCompetencia);
app.delete('/competencias/:id/votos', competenciasControlador.reiniciarCompetencia);
app.get('/competencias/:id', competenciasControlador.buscarCompetencia);
app.get('/generos', competenciasControlador.obtenerGeneros);
app.get('/directores', competenciasControlador.obtenerDirectores);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});

