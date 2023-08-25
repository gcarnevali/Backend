const fs = require('fs');
const path = require('path');
const productsFilePath = path.join('C:/Users/gcarn/Documents/Backend/Proyectos/Clases/archivos/products.json');

const express = require('express');
const productsRouter = express.Router();

let products = [] 

// Función para generar un nuevo ID único
function generateUniqueId(products) {
    const existingIds = products.map(product => product.id);
    let newId = Math.max(...existingIds) + 1;
    while (existingIds.includes(newId)) {
        newId++;
    }
    return newId;
}

// Ruta raíz GET '/'
productsRouter.get('/', (req, res) => {
    // Leer los datos del archivo products.json
    const productsData = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(productsData);

    res.json(products);
});

// Ruta GET '/:pid'
productsRouter.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Producto no encontrado' });
    }
});

// Ruta raíz POST '/'
productsRouter.post('/', (req, res) => {
    try {
        const newProduct = req.body;

        // Leer los datos del archivo products.json
        const productsData = fs.readFileSync(productsFilePath, 'utf8');
        products = JSON.parse(productsData); // Cargar los datos en la variable products

        newProduct.id = generateUniqueId(products);
        products.push(newProduct);

        // Escribir la matriz actualizada de productos en el archivo products.json
        const updatedProductsData = JSON.stringify(products, null, 2);
        fs.writeFileSync(productsFilePath, updatedProductsData);

        res.status(201).json(newProduct); // Devolver el producto recién creado con código de estado 201 (Creado)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});


// Ruta PUT '/:pid'
productsRouter.put('/:pid', (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedProduct = req.body;

        const productsData = fs.readFileSync(productsFilePath, 'utf8');
        let products = JSON.parse(productsData);

        const existingProduct = products.find(p => p.id === productId);
        if (existingProduct) {
            // Mantener el ID original y actualizar los campos enviados desde el body
            Object.assign(existingProduct, updatedProduct);

            const updatedProductsData = JSON.stringify(products, null, 2);
            fs.writeFileSync(productsFilePath, updatedProductsData);

            res.json(existingProduct);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

// Ruta DELETE '/:pid'
productsRouter.delete('/:pid', (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        const productsData = fs.readFileSync(productsFilePath, 'utf8');
        let products = JSON.parse(productsData);

        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            const deletedProduct = products.splice(productIndex, 1)[0];

            const updatedProductsData = JSON.stringify(products, null, 2);
            fs.writeFileSync(productsFilePath, updatedProductsData);

            res.json(deletedProduct);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});




module.exports = productsRouter;
