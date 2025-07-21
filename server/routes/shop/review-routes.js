const express = require('express');
const { 
  addReview, 
  getProductReviews, 
  updateReview, 
  deleteReview 
} = require('../../controllers/shop/review-controller');

const router = express.Router();

// Add a new review
router.post('/add', addReview);

// Get reviews for a product
router.get('/product/:productId', getProductReviews);

// Update a review
router.put('/update/:reviewId', updateReview);

// Delete a review
router.delete('/delete/:reviewId', deleteReview);

module.exports = router; 