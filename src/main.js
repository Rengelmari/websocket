const express = require ('express');
const moment = require('moment');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const Contenedor = require('./contenedor/contenedorFs');
/* const { Socket } = require('dgram');  */
const app = express();

const PUERTO = process.env.PORT || 8080;
const publicRoot = './public';

//***** Hacemos la carpeta public visible
app.use(express.static(publicRoot));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const productos = new Contenedor('./src/bd/productos.txt');
const mensajes = new Contenedor('./src/bd/mensajes.txt');

app.get('/', (peticion, respuesta) => {
    respuesta.send('index.html', {root: publicRoot});
});



const servidor = httpServer.listen(PUERTO, () => {
    console.log(`Servidor escuchando: ${servidor.address().port}`);
});

servidor.on('error', error => console.log(`Error: ${error}`));


io.on('connection', async (socket) =>{
    console.log('Cliente conectado');
    
    const listaProductos = await productos.getAll();
    socket.emit('nueva-conexion', listaProductos);

    socket.on("new-product", (data) => {
        productos.save(data);
        io.sockets.emit('producto', data);
    });

    const listaMensajes = await mensajes.getAll();
    socket.emit('messages', listaMensajes);

  //Evento para recibir nuevos mensajes
    socket.on('new-message', async data => {
    data.time = moment(new Date()).format('DD/MM/YYYY hh:mm:ss');
    await mensajes.save(data);
    const listaMensajes = await mensajes.getAll();
    io.sockets.emit('messages', listaMensajes);
    });

});