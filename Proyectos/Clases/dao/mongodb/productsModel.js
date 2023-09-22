const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    "title": String,
    "description": String,
    "code": Number,
    "price": Number,
    "status": String,
    "stock": Number,
    "category": String,
    "thumbnails": [String],
  });

  const Product = mongoose.model('Product', productSchema)
  
module.exports = Product;