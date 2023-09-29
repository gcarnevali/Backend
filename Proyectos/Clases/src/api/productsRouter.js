const fs = require('fs');
const path = require('path');
const productsFilePath = path.join('C:/Users/gcarn/Documents/Backend/Proyectos/Clases/archivos/products.json');
const Product = require('../../dao/mongodb/productsModel')

const express = require('express');
const productsRouter = express.Router();

Product.plugin(mongoosePaginate)

// Ruta para mostrar la lista de productos
router.get('/', (req, res) => {
    // Obtén la lista de productos desde tu base de datos o de donde estén almacenados
    const products = [{/* ... */}, {/* ... */}, {/* ... */}]; // Reemplaza con tus datos reales
  
    // Renderiza la vista de lista de productos y pasa los productos como contexto
    res.render('products-list', { products });
  });
  
  // Ruta para mostrar los detalles de un producto individual
  router.get('/:productId', (req, res) => {
    const productId = req.params.productId;
  
    // Obtén los detalles del producto con el ID proporcionado desde tu base de datos
    const product = {/* ... */}; // Reemplaza con los datos reales del producto
  
    // Renderiza la vista de detalles de producto y pasa el producto como contexto
    res.render('product-details', { product });
})

// Ruta para obtener todos los productos
productsRouter.get('/', async (req, res) => {
    try {
        // Parámetros de la consulta
        const { page = 1, limit = 10, sort = '', query = '' } = req.query;

        // Opciones de paginación y ordenamiento
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : null,
        };

        // Filtros de búsqueda (si se proporciona un query)
        const filters = query ? { title: { $regex: query, $options: 'i' } } : {};

        // Utiliza la función `paginate` proporcionada por `mongoose-paginate-v2`
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
