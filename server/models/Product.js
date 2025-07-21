const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  image: String,
  title: String,
  description: String,
  category: String,
  brand: String,
  price: Number,
  salePrice: {
    type: Number,
    default: null
  },
  totalStock: Number,
  averageRating: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
},{timestamps:true});

module.exports = mongoose.model('Product',  ProductSchema);
