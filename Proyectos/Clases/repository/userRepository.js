const User = require('../models/userModel'); // Asegúrate de importar tu modelo de usuario

class UserRepository {
    async getUserById(userId) {
        return User.findById(userId);
    }

    // Agrega más métodos según sea necesario para interactuar con la base de datos
}

module.exports = new UserRepository();
