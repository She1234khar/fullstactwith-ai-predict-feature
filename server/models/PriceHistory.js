const mongoose = require('mongoose');

const PriceHistorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  salePrice: {
    type: Number,
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for efficient queries
PriceHistorySchema.index({ productId: 1, date: -1 });

module.exports = mongoose.model('PriceHistory', PriceHistorySchema); 