const express = require('express'); 
const exphbs = require('express-handlebars');
const http = require('http');
const io = require('socket.io');
const fs = require('fs'); 

const productsRouter = require('./api/productsRouter');
const cartsRouter = require('./api/cartsRouter');

const PORT = 8080;

const app = express(); 

// Configura el motor de vistas Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Crea un servidor HTTP y WebSocket
const server = http.createServer(app);
const socketIO = io(server);

// Función para obtener los productos actualizados desde el archivo products.json
function getUpdatedProducts() {
    try {
        const productsData = fs.readFileSync('C:/Users/gcarn/Documents/Backend/ProyectoClases/archivos/products.json', 'utf8');
        const products = JSON.parse(productsData);
        return products;
    } catch (error) {
        console.error('Error al leer el archivo products.json:', error);
        return [];
    }
}

// Función para enviar productos actualizados a través de WebSocket
function sendUpdatedProducts() {
    const updatedProducts = getUpdatedProducts();
    socketIO.sockets.emit('updateProducts', updatedProducts);
}

// Configura WebSocket
socketIO.on('connection', (socket) => {
    console.log('Usuario conectado');
});

// Rutas para productos y carritos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta POST para productos
app.post('/api/products', (req, res) => {
    const updatedProducts = getUpdatedProducts();
    sendUpdatedProducts(updatedProducts);
    res.sendStatus(200); // Envía una respuesta exitosa (código 200)
});

// Ruta DELETE para productos
app.delete('/api/products/:productId', (req, res) => {
    const updatedProducts = getUpdatedProducts();
    sendUpdatedProducts(updatedProducts);
    res.sendStatus(200); // Envía una respuesta exitosa (código 200)
});


// Inicia el servidor HTTP
server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
