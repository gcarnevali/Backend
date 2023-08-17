const productManager = require('./Carnevali-ProductManager2')//Paso 1 import clase
const fs = require('fs'); //Paso 2 importar libreria fs

const express = require('express')//Paso 3 importar liberia express, declarar puerto, e instanciar variable entorno
const PORT = 3000
const app = express()

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {//Paso 3: declarar la ruta de inicio
    res.send('Hola, este es el HOME')
});

app.get('/products', (req, res) => {
    fs.readFile('C:/Users/gcarn/Documents/Backend/Proyectos/Clases/archivos/products.json', 'utf8', (err, data) => { //Paso 4: utilizamos fs.readFile() para acceder al products.json
        if (err) {//Punto de prueba
            console.error(err);
            res.send('Error');
            return;
        }

        try {
            const products = JSON.parse(data);//Paso 5: Parseamos la data del product.json para que se pueda leer

            const limite = parseInt(req.query.limite);//Paso 6: Obtenemos el valor limite de la consulta si es necesario
            if (!isNaN(limite) && limite > 0) {//Paso 7: Usamos if y slice para "cortar" y separar al numero especificado de productos
                const limiteProducts = products.slice(0, limite)
                res.json(limiteProducts)//Paso 7: Que el servidor responda con el condicional hecho 
            } else {
                res.json(products) //Paso 7: Si falla, devuelve todos los productos
            }

        } catch (parseErr) {//Punto de prueba 
            console.error(parseErr);
            res.send('Error');
        }
    });
});

app.get('/products/:pid', (req, res) => {
    fs.readFile('C:/Users/gcarn/Documents/Backend/Proyectos/Clases/archivos/products.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.send('Error 1');
            return;
        }

        try {
            const products = JSON.parse(data)

            const productId = req.params.pid; //Obtener el pId de los parametros de ruta

            console.log(typeof productId)//Siemore declarar antes de la comparacion para saber que tipo de dato estamos manejando
            const productoFiltrado = products.find(p => p.id === parseInt(productId));//Asi se declara una variable para filtrar por id

            if (productoFiltrado) {
                res.json(productoFiltrado)

            } else {
                throw new Error(`No se encontró un producto con id ${productId}`);
            }


        } catch (parseErr) {//Punto de prueba 
            console.error(parseErr);
            res.send('Error 2');
        }
    })
});

app.listen(PORT, () => {
    console.log(`Corriendo en ${PORT}`)
})
