const fs = require('fs');
const path = require('path');
const cartsFilePath = path.join('C:/Users/gcarn/Documents/Backend/Proyectos/Clases/archivos/carts.json');

const express = require('express');
const cartsRouter = express.Router();

let carts = [];

// Función para generar un nuevo ID único
function generateUniqueId(carts) {
    const existingIds = carts.map(cart => cart.id);
    let newId = Math.max(...existingIds) + 1;
    while (existingIds.includes(newId)) {
        newId++;
    }
    return newId;
}

// Ruta raíz POST '/'
cartsRouter.post('/', (req, res) => {
    try {
        const newCart = {
            id: generateUniqueId(carts),
            products: []
        };

        carts.push(newCart);

        // Escribir la matriz actualizada de carritos en el archivo carts.json
        const updatedCartsData = JSON.stringify(carts, null, 2);
        fs.writeFileSync(cartsFilePath, updatedCartsData);

        res.status(201).json(newCart); // Devolver el carrito recién creado con código de estado 201 (Creado)
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
cartsRouter.post('/:cid/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const cart = carts.find(c => c.id === cartId);

    if (!cart) {
        res.status(404).json({ message: 'Carrito no encontrado' });
        return;
    }

    const product = productsRouter.find(p => p.id === productId);

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

    res.status(201).json(cart); // Devolver el carrito actualizado con el producto agregado
});


// Implementa más rutas para carritos aquí

module.exports = cartsRouter;
