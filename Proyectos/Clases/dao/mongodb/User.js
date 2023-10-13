const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, // Asegura que no puede haber dos usuarios con el mismo nombre de usuario
    required: true, // Requerido, es decir, este campo debe estar presente
  },
  email: {
    type: String,
    unique: true, // Asegura que no puede haber dos usuarios con el mismo correo electrónico
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Establece la fecha de creación automáticamente
  },
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
