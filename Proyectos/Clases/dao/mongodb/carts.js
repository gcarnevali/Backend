const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Referencia al usuario al que pertenece el carrito
    ref: 'User',
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId, // Referencia al producto en el carrito
        ref: 'Product',
      },
      quantity: Number, // Cantidad de productos del mismo tipo en el carrito
    },
  ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
