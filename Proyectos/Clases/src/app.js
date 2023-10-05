const express = require('express'); 
const exphbs = require('express-handlebars');
const http = require('http');
const io = require('socket.io');
const fs = require('fs'); 
const mongoose = require('mongoose')
const Product = require('../dao/mongodb/productsModel');
const Cart = require('../dao/mongodb/carts');
const Message = require('../dao/mongodb/messages');
const User = require('../dao/mongodb/User');

const mongoURI = "mongodb+srv://gcarnevali:030401@cluster0.cpd0f1h.mongodb.net/?retryWrites=true&w=majority";

const productsRouter = require('./api/productsRouter');
const cartsRouter = require('./api/cartsRouter');

const PORT = 8080;

const app = express(); 

// Configura Mongoose
mongoose.connect(mongoURI, {
    useNewUrlParser: true ,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Conexion a MongoDB exitosa')
})
.catch((err) =>{
    console.error(`Error al conectar con la base de datos ${err}`)
})


// Configura el motor de vistas Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.get('/chat', (req, res) => {
    // Renderiza la vista de chat
    res.render('chat');
});

// Crea un servidor HTTP y WebSocket
const server = http.createServer(app);
const socketIO = io(server);

const session = require('express-session');

app.use(session({
  secret: 'tu_secreto_aqui',
  resave: false,
  saveUninitialized: true,
}));

// Configura WebSocket
socketIO.on('connection', (socket) => {
    console.log('Usuario conectado');

    // Maneja el evento 'chatMessage' cuando se recibe un mensaje del cliente
    socket.on('chatMessage', (message) => {
        socketIO.sockets.emit('chatMessage', message);
    });
});


// Rutas para productos y carritos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta POST para productos
app.post('/api/products', async (req, res) => {
    try {
        const newProduct = req.body;

        // Crea un nuevo documento de producto utilizando el modelo
        const product = new Product(newProduct);

        // Guarda el nuevo producto en la base de datos
        await product.save();

        // Envía una respuesta exitosa (código 201) con el producto creado
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
});


// Ruta DELETE para productos
app.delete('/api/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        // Busca y elimina el producto por su ID
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (deletedProduct) {
            // Envía una respuesta exitosa (código 200) con el producto eliminado
            res.status(200).json(deletedProduct);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
});

app.put('/api/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProduct = req.body;

        // Busca y actualiza el producto por su ID
        const updatedProductData = await Product.findByIdAndUpdate(
            productId,
            updatedProduct,
            { new: true } // Esto devuelve el producto actualizado en lugar del antiguo
        );

        if (updatedProductData) {
            // Envía una respuesta con el producto actualizado
            res.json(updatedProductData);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});



// Inicia el servidor HTTP
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
