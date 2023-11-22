function errorHandler(err) {
    console.error(err);
    const statusCode = err.statusCode || 500;
    const message = errorDictionary[err.message] || 'Error interno del servidor';
    res.status(statusCode).json({ message });
  }

  const errorDictionary = {
    'product_not_found': 'El producto no se encontró',
    'product_already_exists': 'El producto ya existe',
    'product_invalid_data': 'Los datos del producto son inválidos',
    'cart_not_found': 'El carrito no se encontró',
    'product_not_in_cart': 'El producto no está en el carrito',
  };

  module.exports = { errorHandler };