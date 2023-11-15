function createUserDTO(user) {
    return {
        id: user._id,
        username: user.username,
        // Otras propiedades necesarias
    };
}

module.exports = { createUserDTO };
