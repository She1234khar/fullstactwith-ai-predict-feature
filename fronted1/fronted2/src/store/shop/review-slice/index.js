import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [],
  totalReviews: 0,
  averageRating: 0,
  isLoading: false,
  error: null
};

// Add a new review
export const addReview = createAsyncThunk(
  'review/addReview',
  async (reviewData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/reviews/add`,
      reviewData
    );
    return response.data;
  }
);

// Get reviews for a product
export const getProductReviews = createAsyncThunk(
  'review/getProductReviews',
  async (productId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/reviews/product/${productId}`
    );
    return response.data;
  }
);

// Update a review
export const updateReview = createAsyncThunk(
  'review/updateReview',
  async ({ reviewId, reviewData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/shop/reviews/update/${reviewId}`,
      reviewData
    );
    return response.data;
  }
);

// Delete a review
export const deleteReview = createAsyncThunk(
  'review/deleteReview',
  async ({ reviewId, userId }) => {
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/shop/reviews/delete/${reviewId}`,
      { data: { userId } }
    );
    return reviewId;
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.totalReviews = 0;
      state.averageRating = 0;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add Review
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.unshift(action.payload.data);
        state.totalReviews += 1;
        // Recalculate average rating
        const totalRating = state.reviews.reduce((sum, review) => sum + review.rating, 0);
        state.averageRating = totalRating / state.reviews.length;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      
      // Get Product Reviews
      .addCase(getProductReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data.reviews;
        state.totalReviews = action.payload.data.totalReviews;
        state.averageRating = action.payload.data.averageRating;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.reviews.findIndex(review => review._id === action.payload.data._id);
        if (index !== -1) {
          state.reviews[index] = action.payload.data;
        }
        // Recalculate average rating
        const totalRating = state.reviews.reduce((sum, review) => sum + review.rating, 0);
        state.averageRating = totalRating / state.reviews.length;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = state.reviews.filter(review => review._id !== action.payload);
        state.totalReviews -= 1;
        // Recalculate average rating
        if (state.reviews.length > 0) {
          const totalRating = state.reviews.reduce((sum, review) => sum + review.rating, 0);
          state.averageRating = totalRating / state.reviews.length;
        } else {
          state.averageRating = 0;
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearReviews, clearError } = reviewSlice.actions;
export default reviewSlice.reducer; 