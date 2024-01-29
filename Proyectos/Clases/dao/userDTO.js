function createUserDTO(user) {
    return {
        id: user._id,
        username: user.username,
        mail: user.mail,
        // Otras propiedades necesarias
    };
}

module.exports = { createUserDTO };
