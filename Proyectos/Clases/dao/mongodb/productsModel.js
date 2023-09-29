const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

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
  productSchema.plugin(mongoosePaginate);
  
  
module.exports = Product;