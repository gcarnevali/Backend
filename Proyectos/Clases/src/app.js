const productsRouter = require('./api/productsRouter')
const cartsRouter = require('./api/cartsRouter')

const exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const http = require('http').createServer(app);
const io = require('socket.io')(http);

function getUpdatedProducts() {
    try {

        const productsData = fs.readFileSync('C:/Users/gcarn/Documents/Backend/ProyectoClases/archivos/products.json', 'utf8');

        // Parsea los datos JSON en un objeto JavaScript
        const products = JSON.parse(productsData);

        return products;
    } catch (error) {
        console.error('Error al leer el archivo products.json:', error);
        return []; // Devuelve un array vacío en caso de error o archivo no encontrado
    }
}

function sendUpdatedProducts() {


    io.sockets.emit('updateProducts', updatedProducts);
}

io.on('connection', (socket) => {
    console.log('Usuario conectado');
});

app.post('/api/products', (req, res) => {

    const updatedProducts = getUpdatedProducts();


    sendUpdatedProducts(updatedProducts);
});


app.delete('/api/products/:productId', (req, res) => {

    const updatedProducts = getUpdatedProducts();


    sendUpdatedProducts(updatedProducts);
})


http.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});


const express = require('express')//Paso 3 importar liberia express, declarar puerto, e instanciar variable entorno
const PORT = 8080
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(PORT, () => {
    console.log(`Corriendo en ${PORT}`)
})




