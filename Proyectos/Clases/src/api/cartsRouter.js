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
cartsRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        // Busca el carrito por su ID y utiliza populate para cargar los productos asociados
        const cart = await Cart.findById(cartId).populate('products.product');

        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el carrito' });
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

// Ruta DELETE '/:cid/products/:pid'
cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Encuentra el carrito por su ID utilizando el modelo de MongoDB
        const cart = await Cart.findById(cartId);

        if (!cart) {
            res.status(404).json({ message: 'Carrito no encontrado' });
            return;
        }

        // Verifica si el producto existe en el carrito
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex === -1) {
            res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            return;
        }

        // Elimina el producto del carrito
        cart.products.splice(productIndex, 1);

        await cart.save(); // Guarda el carrito actualizado en la base de datos

        res.json(cart); // Devuelve el carrito actualizado después de eliminar el producto
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
    }
});

// Ruta PUT '/:cid'
cartsRouter.put('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const updatedProducts = req.body.products;

        // Encuentra el carrito por su ID utilizando el modelo de MongoDB
        const cart = await Cart.findById(cartId);

        if (!cart) {
            res.status(404).json({ message: 'Carrito no encontrado' });
            return;
        }

        // Actualiza el arreglo de productos en el carrito
        cart.products = updatedProducts;

        await cart.save(); // Guarda el carrito actualizado en la base de datos

        res.json(cart); // Devuelve el carrito actualizado como respuesta
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el carrito' });
    }
});

// Ruta PUT '/:cid/products/:pid'
cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;

        // Encuentra el carrito por su ID utilizando el modelo de MongoDB
        const cart = await Cart.findById(cartId);

        if (!cart) {
            res.status(404).json({ message: 'Carrito no encontrado' });
            return;
        }

        // Encuentra el producto en el carrito por su ID
        const productInCart = cart.products.find(p => p.product == productId);

        if (!productInCart) {
            res.status(404).json({ message: 'Producto no encontrado en el carrito' });
            return;
        }

        // Actualiza la cantidad de ejemplares del producto
        productInCart.quantity = quantity;

        await cart.save(); // Guarda el carrito actualizado en la base de datos

        res.json(cart); // Devuelve el carrito actualizado como respuesta
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

// Ruta DELETE '/:cid'
cartsRouter.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        // Elimina el carrito por su ID utilizando el modelo de MongoDB
        const deletedCart = await Cart.findByIdAndRemove(cartId);

        if (deletedCart) {
            res.json(deletedCart);
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el carrito' });
    }
});
module.exports = cartsRouter;
