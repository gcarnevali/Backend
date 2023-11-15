const daoFactory = require('../dao/daoFactory');
const userDTO = require('../dao/userDTO');

const daoType = 'mongo'; // Puedes obtenerlo desde la línea de comandos o configuración
const userDAO = daoFactory.createDAO(daoType);

async function getUserById(userId) {
    const user = await userDAO.getUserById(userId);
    return userDTO.createUserDTO(user);
}

const userRepository = require('../dao/userRepository');

class UserService {
    async getUserById(userId) {
        return userRepository.getUserById(userId);
    }

    // Puedes agregar más métodos según sea necesario
}

module.exports = new UserService();

