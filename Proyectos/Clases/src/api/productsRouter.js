const fs = require('fs');
const path = require('path');
const productsFilePath = path.join('C:/Users/gcarn/Documents/Backend/Proyectos/Clases/archivos/products.json');
const Product = require('../../dao/mongodb/productsModel')

const express = require('express');
const productsRouter = express.Router();


// Ruta para obtener todos los productos
productsRouter.get('/', async (req, res) => {
    try {
      const products = await Product.find(); // Utiliza el método .find() del modelo para obtener todos los productos
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los productos' });
    }

    /*res.render('home', { products })*/
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
productsRouter.post('/', async (req, res) => {
    try {
        const newProduct = req.body;

        // Crea un nuevo producto utilizando el modelo de MongoDB
        const product = new Product(newProduct);

        // Guarda el producto en la base de datos
        await product.save();

        res.status(201).json(product); // Devolver el producto recién creado con código de estado 201 (Creado)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});



// Ruta PUT '/:pid'
productsRouter.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedProduct = req.body;

        // Busca y actualiza el producto en la base de datos utilizando el modelo de MongoDB
        const product = await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});


// Ruta DELETE '/:pid'
productsRouter.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;

        // Elimina el producto de la base de datos utilizando el modelo de MongoDB
        const deletedProduct = await Product.findByIdAndRemove(productId);

        if (deletedProduct) {
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
