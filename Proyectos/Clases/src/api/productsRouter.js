const fs = require('fs');
const path = require('path');
const productsFilePath = path.join('C:/Users/gcarn/Documents/Backend/Proyectos/Clases/archivos/products.json');
const Product = require('../../dao/mongodb/productsModel')
const mongoosePaginate = require('mongoose-paginate-v2');
const expresSession = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { isAdmin, isUser } = require('../middleware/authMiddleware');

const express = require('express');
const productsRouter = express.Router();

// Middleware para proteger rutas con Passport
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Ruta para el dashboard (protegida por el middleware)
productsRouter.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard');
});


// Ruta para inicio de sesión (usando estrategia local)
productsRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true // Puedes usar flash messages para mensajes de error
}));

// Ruta para autenticación de GitHub
productsRouter.get('/auth/github', passport.authenticate('github'));

// Ruta de callback para autenticación de GitHub
productsRouter.get('/auth/github/callback',
    passport.authenticate('github', { successRedirect: '/dashboard', failureRedirect: '/login' })
);

// Serialización y deserialización de usuarios (típico para Passport)
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    // Aquí debes buscar al usuario por su ID en la base de datos y pasar el usuario a través de "done".
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
// Ruta para obtener todos los productos paginados
productsRouter.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '', query = '' } = req.query;

        // Opciones de paginación y ordenamiento
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : null,
        };

        // Filtros de búsqueda
        const filters = query ? { title: { $regex: query, $options: 'i' } } : {};

        // Utiliza la función `paginate` 
        const result = await Product.paginate(filters, options);

        // Construye la respuesta con el formato especificado
        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage || null,
            nextPage: result.nextPage || null,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null,
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los productos paginados' });
    }
});


productsRouter.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        // Realiza una consulta a la base de datos MongoDB para obtener el producto por ID
        const product = await Product.findById(productId);

        if (product) {
            // Renderiza la vista de detalles de producto y pasa el producto como contexto
            res.render('product-details', { product });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los detalles del producto' });
    }
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


productsRouter.post('/', isAdmin, async (req, res) => {
    try {
        // Lógica para crear un producto
        const newProduct = req.body;
        // Verificar si el usuario actual tiene permisos de administrador
        // Hacer la creación del producto
        res.status(201).json({ message: 'Producto creado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});

productsRouter.put('/:productId', isAdmin, async (req, res) => {
    try {
        // Lógica para actualizar un producto
        const productId = req.params.productId;
        // Verificar si el usuario actual tiene permisos de administrador
        // Hacer la actualización del producto
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

productsRouter.get('/', async (req, res) => {
    try {
        // Lógica para obtener la lista de productos
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener la lista de productos' });
    }
});

app.get('/products', async (req, res) => {
    // ...
    devLogger.debug('Obteniendo productos', {
      route: '/products',
    });
    prodLogger.info('Obteniendo productos', {
      route: '/products',
    });
    // ...
  });

module.exports = productsRouter;
