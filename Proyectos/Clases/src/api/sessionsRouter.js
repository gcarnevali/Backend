const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Reemplaza con la ubicación de tu modelo de usuario

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;

        // Verifica si el usuario ya existe en la base de datos
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Crea un nuevo usuario
        const user = new User({ first_name, last_name, email, age, password });

        // Guarda el nuevo usuario en la base de datos
        await user.save();

        res.status(201).json({ message: 'Registro exitoso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error en el registro' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verifica si el usuario existe en la base de datos
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Verifica la contraseña
        if (user.password !== password) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Almacena el usuario en la sesión
        req.session.user = user;

        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error en el inicio de sesión' });
    }
});

router.get('/logout', (req, res) => {
    // Cierra la sesión
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error al cerrar sesión' });
        } else {
            res.redirect('/login');
        }
    });
});
module.exports = router;
