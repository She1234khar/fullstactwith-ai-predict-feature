const express = require('express');
const router = express.Router();
const { getPriceHistory, getPricePrediction } = require('../../controllers/shop/price-trend-controller');

// Get price history for a product
router.get('/history/:productId', getPriceHistory);

// Get price prediction and recommendation
router.get('/prediction/:productId', getPricePrediction);

module.exports = router; 