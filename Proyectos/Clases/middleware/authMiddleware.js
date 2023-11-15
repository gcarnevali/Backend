function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    } else {
        res.status(403).json({ message: 'Acceso no autorizado' });
    }
}

// Este middleware verifica si el usuario es un usuario común
function isUser(req, res, next) {
    if (req.user && req.user.role === 'user') {
        return next();
    } else {
        res.status(403).json({ message: 'Acceso no autorizado' });
    }
}

module.exports = { isAdmin, isUser };