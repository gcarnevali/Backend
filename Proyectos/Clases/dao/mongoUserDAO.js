const User = require('../models/user'); // Asume que tienes un modelo User

async function getUserById(userId) {
    return User.findById(userId);
}

// Otras operaciones como createUser, updateUser, etc.

module.exports = { getUserById };
