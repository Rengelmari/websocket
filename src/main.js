const express = require ('express');
const app = express();

const PUERTO = process.env.PORT || 8080;
const publicRoot = './public';

//***** Hacemos la carpeta public visible
app.use('/static', express.static(publicRoot));

app.use(express.json());
app.use(express.urlencoded({extended: true}));



class Contenedor {
    constructor(productos) {
        this.productos = productos;
    }

    save(objeto) {
        if (objeto.id) {
        this.productos.push(objeto);
        return objeto.id;
        }

        let id = 1;
        this.productos.forEach((element, index) => {
        if (element.id >= id) {
            id = element.id + 1;
        }
        });
        objeto.id = id;
        this.productos.push(objeto);
        return id;
    }

    update(producto) {
        this.productos = this.productos.map((element) => {
        if (element.id == producto.id) {
            return producto;
        }
        return element;
        });
    }

    getById(id) {
        let objetoSeleccionado = null;
        this.productos.forEach(element => {
        if (element.id == id) {
            objetoSeleccionado = element;
        }
        });
        return objetoSeleccionado;
    }

    getAll() {
        return this.productos;
    }

    deleteById(id) {
        let indexSeleccionado = -1;
        this.productos.forEach((element, index) => {
        if (element.id == id) {
            indexSeleccionado = index;
        }
        });
        if (indexSeleccionado != -1) {
        this.productos.splice(indexSeleccionado, 1);
        }

    }

    deleteAll() {
        this.productos = [];
    }
}

const productos = new Contenedor([]);



/* app.get('/productos', (peticion, respuesta) => {
    const listaProductos = productos.getAll();
    respuesta.render('lista', {
        productos: listaProductos
    });
}); */
/* 
app.post('/', (peticion, respuesta) => {
    const producto = peticion.body;
    productos.save(producto);
    respuesta.render('formulario', {});
}); */

app.get('/', (peticion, respuesta) => {
    respuesta.send('index.html', {root: publicRoot});
});



const servidor = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando: ${servidor.address().port}`);
});

servidor.on('error', error => console.log(`Error: ${error}`));

