const express = require('express');
const cartsRouter = express.Router();

// Datos de ejemplo (reemplaza con tus propios datos)
const carts = [
    { id: 1, items: ['Producto 1', 'Producto 2'] },
    { id: 2, items: ['Producto 3'] }
];

// Implementa rutas para carritos aquí

module.exports = cartsRouter;
