const mongooseUserDAO = require('./mongooseUserDAO');
// Otros DAOs si los tienes

function createDAO(type) {
    switch (type) {
        case 'mongo':
            return mongooseUserDAO;
        // Otros casos según tus DAOs
        default:
            throw new Error('Tipo de DAO no válido');
    }
}

module.exports = { createDAO };
