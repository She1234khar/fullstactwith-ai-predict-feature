const mongoose = require('mongoose');
const Review = require('../../models/Review');
const Product = require('../../models/Product');

// Add a new review
const addReview = async (req, res) => {
  try {
    const { productId, userId, userName, rating, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Create new review
    const newReview = new Review({
      productId,
      userId,
      userName,
      rating,
      comment
    });

    await newReview.save();

    // Update product's average rating
    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: newReview
    });

  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review'
    });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 }) // Latest first
      .limit(20); // Limit to 20 reviews

    const totalReviews = await Review.countDocuments({ productId });
    const averageRating = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        reviews,
        totalReviews,
        averageRating: averageRating.length > 0 ? averageRating[0].avgRating : 0
      }
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const { userId } = req.body; // For authorization

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own review'
      });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    // Update product's average rating
    await updateProductRating(review.productId);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review'
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { userId } = req.body; // For authorization

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns this review
    if (review.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own review'
      });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);

    // Update product's average rating
    await updateProductRating(productId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review'
    });
  }
};

// Helper function to update product's average rating
const updateProductRating = async (productId) => {
  try {
    const result = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, totalReviews: { $sum: 1 } } }
    ]);

    if (result.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        averageRating: Math.round(result[0].avgRating * 10) / 10, // Round to 1 decimal
        totalReviews: result[0].totalReviews
      });
    }
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};

module.exports = {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview
}; 