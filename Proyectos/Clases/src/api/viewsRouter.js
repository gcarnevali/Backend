const express = require('express');
const router = express.Router();


function isAuthenticated(req, res, next) {
    if (req.session.user) {
        // El usuario está autenticado, permite el acceso
        return next();
    } else {
        // El usuario no está autenticado, redirige a la página de inicio de sesión
        return res.redirect('/login');
    }
}

// Ruta de perfil protegida (solo accesible para usuarios autenticados)
router.get('/profile', isAuthenticated, (req, res) => {
    // Aquí puedes renderizar la vista de perfil con datos del usuario
    res.render('profile', { user: req.session.user });
});


module.exports = router;

S