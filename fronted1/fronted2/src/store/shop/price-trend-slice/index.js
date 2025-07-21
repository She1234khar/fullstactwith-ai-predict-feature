import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching price prediction
export const fetchPricePrediction = createAsyncThunk(
  'priceTrend/fetchPrediction',
  async (productId) => {
    const response = await fetch(`/api/shop/price-trend/prediction/${productId}`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch price prediction');
    }
    return data.data;
  }
);

// Async thunk for fetching price history
export const fetchPriceHistory = createAsyncThunk(
  'priceTrend/fetchHistory',
  async (productId) => {
    const response = await fetch(`/api/shop/price-trend/history/${productId}`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch price history');
    }
    return data.data;
  }
);

const initialState = {
  priceData: null,
  priceHistory: [],
  loading: false,
  error: null
};

const priceTrendSlice = createSlice({
  name: 'priceTrend',
  initialState,
  reducers: {
    clearPriceData: (state) => {
      state.priceData = null;
      state.priceHistory = [];
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Price Prediction
      .addCase(fetchPricePrediction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPricePrediction.fulfilled, (state, action) => {
        state.loading = false;
        state.priceData = action.payload;
        state.error = null;
      })
      .addCase(fetchPricePrediction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Price History
      .addCase(fetchPriceHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPriceHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.priceHistory = action.payload;
        state.error = null;
      })
      .addCase(fetchPriceHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearPriceData, setError } = priceTrendSlice.actions;
export default priceTrendSlice.reducer; 