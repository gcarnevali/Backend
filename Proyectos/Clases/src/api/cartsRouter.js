const fs = require('fs');
const path = require('path');
const cartsFilePath = path.join('C:/Users/gcarn/Documents/Backend/Proyectos/Clases/dao/filesystem/products.json');
const Cart = require('../../dao/mongodb/carts'); // Importa el modelo de carritos de MongoDB
const TicketService = require('../../services/ticketService');

const express = require('express');
const cartsRouter = express.Router();

let carts = [];

// Define la ruta
cartsRouter.post('/:cid/purchase', async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await Cart.findById(cartId).populate('items.product');
  
      if (!cart) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
      }
  
      // Inicializa un array para almacenar los productos que no se pudieron procesar
      const productsNotProcessed = [];
  
      // Itera sobre los productos en el carrito
      for (const item of cart.items) {
        const product = item.product;
        const quantityToPurchase = item.quantity;
  
        // Verifica si hay suficiente stock para la cantidad deseada
        if (product.stock >= quantityToPurchase) {
          // Resta la cantidad comprada del stock del producto
          product.stock -= quantityToPurchase;
          await product.save();
  
          // Crea un ticket con los detalles de la compra
          const ticketData = {
            productId: product._id,
            productName: product.name,
            quantity: quantityToPurchase,
            price: product.price,
            total: quantityToPurchase * product.price,
          };
  
          // Utiliza el servicio de Tickets para generar el ticket
          await TicketService.createTicket(ticketData);
  
          // Elimina el producto del carrito
          cart.items = cart.items.filter((i) => i.product !== product);
        } else {
          // Si no hay suficiente stock, agrega el ID del producto al array de no procesados
          productsNotProcessed.push(product._id);
        }
      }
  
      // Actualiza el estado del carrito y asocia el ticket si hay productos procesados
      if (cart.items.length > 0) {
        cart.status = 'completed';
        cart.ticket = /* Asigna el ID del ticket creado */
        await cart.save();
      } else {
        // Si no hay productos procesados, actualiza el estado del carrito sin completar la compra
        cart.status = 'failed';
        await cart.save();
      }
  
      res.json({ message: 'Compra completada', productsNotProcessed });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al procesar la compra' });
    }
  });

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
