const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: String, // El nombre del usuario que envió el mensaje
  text: String, // El contenido del mensaje
  timestamp: {
    type: Date,
    default: Date.now, // Establece la fecha de creación automáticamente
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
