const productsRouter = require('./api/productsRouter')
const cartsRouter = require('./api/cartsRouter')

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
