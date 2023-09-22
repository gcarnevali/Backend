const fs = require('fs');
const path = require('path');
const cartsFilePath = path.join('C:/Users/gcarn/Documents/Backend/Proyectos/Clases/dao/filesystem/products.json');
const Cart = require('../../dao/mongodb/carts'); // Importa el modelo de carritos de MongoDB


const express = require('express');
const cartsRouter = express.Router();

let carts = [];

// Ruta raíz POST '/'
cartsRouter.post('/', async (req, res) => {
    try {
        const newCart = {
            products: []
        };

        const createdCart = await Cart.create(newCart); // Crea un nuevo carrito utilizando el modelo de MongoDB

        res.status(201).json(createdCart); // Devuelve el carrito recién creado con código de estado 201 (Creado)
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el carrito' });
    }
});


// Ruta GET '/:cid'
cartsRouter.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const cart = carts.find(c => c.id === cartId);

    if (cart) {
        res.json(cart.products);
    } else {
        res.status(404).json({ message: 'Carrito no encontrado' });
    }
});

// Ruta POST '/:cid/:pid'
cartsRouter.post('/:cid/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Encuentra el carrito por su ID utilizando el modelo de MongoDB
        const cart = await Cart.findById(cartId);

        if (!cart) {
            res.status(404).json({ message: 'Carrito no encontrado' });
            return;
        }

        // Encuentra el producto por su ID utilizando el modelo de MongoDB
        const product = await Product.findById(productId);

        if (!product) {
            res.status(404).json({ message: 'Producto no encontrado' });
            return;
        }

        const existingProductInCart = cart.products.find(p => p.product === productId);

        if (existingProductInCart) {
            existingProductInCart.quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save(); // Guarda el carrito actualizado en la base de datos

        res.status(201).json(cart); // Devuelve el carrito actualizado con el producto agregado
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al agregar el producto al carrito' });
    }
});




module.exports = cartsRouter;
