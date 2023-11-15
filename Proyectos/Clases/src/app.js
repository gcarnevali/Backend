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
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session')
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const daoFactory = require('./dao/daoFactory');
const argv = require('yargs').argv;
const express = require('express');
const userService = require('./services/userService');

const daoType = argv.dao || 'mongo'; // Obtén el tipo de DAO desde la línea de comandos o utiliza un valor predeterminado
const userDAO = daoFactory.createDAO(daoType);

passport.use(new LocalStrategy(
  function (username, password, done) {
    // Verifica las credenciales del usuario aquí
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Nombre de usuario incorrecto' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
      return done(null, user);
    });
  }
));
passport.use(new GitHubStrategy({
  clientID: "3b5458b7363255a6dec2",
  clientSecret: "96ab84147c3517c1515537bfcc2d791c74b975f5", // Reemplaza con tu secreto de cliente
  callbackURL: 'http://localhost:3000/auth/github/callback'
},
  function (accessToken, refreshToken, profile, done) {
    // Verifica y busca o crea un usuario a partir del perfil de GitHub
    User.findOne({ githubId: profile.id }, function (err, user) {
      if (err) { return done(err); }
      if (user) {
        return done(null, user);
      } else {
        // Crea un nuevo usuario a partir de los datos de GitHub
        const newUser = new User({
          username: profile.username,
          githubId: profile.id
        });
        newUser.save(function (err) {
          if (err) return done(err);
          return done(null, newUser);
        });
      }
    });
  }
));

// Configuracion de la aplicacion
const app = express();
const PORT = 8080;

// Configuracion de sesiones de passport
app.use(passport.initialize());
app.use(passport.session());
app.use(session({ secret: 'tu_secreto_secreto', resave: false, saveUninitialized: true }));

//Configuracion de Mongoose
const mongoURI = "mongodb+srv://gcarnevali:030401@cluster0.cpd0f1h.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Conexion a MongoDB exitosa')
  })
  .catch((err) => {
    console.error(`Error al conectar con la base de datos ${err}`)
  })

// Configura el motor de vistas Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.get('/chat', (req, res) => {
  // Renderiza la vista de chat
  res.render('chat');
});

// Serializacion y deserializacion de usuarios
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // Aquí debes buscar al usuario por su ID
  User.findById(id, function(err, user) {
      done(err, user);
  });
});

// Crea un servidor HTTP y WebSocket
const server = http.createServer(app);
const socketIO = io(server);

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
const productsRouter = require('./api/productsRouter');
const cartsRouter = require('./api/cartsRouter');
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

app.get('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  const user = await userService.getUserById(userId);
  res.json(user);
});

// Inicia el servidor HTTP
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


