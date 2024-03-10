//! Importo la dependencia
const express = require('express');

//! Importo la clase de ProductManager
const ProductManager =  require('./ProductManager')

//** Asigno la funcion express a app
const app = express();

//** Asigno el numero de puerto a una constante
const PUERTO = 8080;

//! Creando la Instancia de la clase ProductManager
const productManager = new ProductManager();

// Para trabajar con datos complejos
app.use(express.urlencoded({extended:true}))

app.get("/", (request, response) => {
    response.send("Probando el servidor");
})

app.get("/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        let limit = parseInt(req.query.limit)

        if(limit >= 0) {
            let newArrayProducts = products.slice(0, limit);

            res.send(newArrayProducts);
        } else {
            res.send(products);
        }

    } catch (error) {
        console.log("Error al obtener los productos: ", error.message);
        res.send("Error al obtener los productos.")
    }
})

app.get("/products/:pid", async (req, res) => {
    //! Todos los datos que se recuperan de los params son Strings, hay que parsearlos
    const products = await productManager.getProducts();

    // el parametro tiene que llamarse igual que en la ruta /products/:pid para llamarlo así desde params
    let pid = parseInt(req.params.pid);
    let product = products.find(product => product.id === pid);

    if(product) {
        res.send(product)
    } else {
        res.send("Producto no encontrado.")
    }
})

app.listen(PUERTO, () => {
    console.log(`Escuchando el en puerto http//localhost:${PUERTO}`);
})