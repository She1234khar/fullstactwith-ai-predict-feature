import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
const initialState = {
  isLoading: false,
  productList: [],
  productDetails :null
};

export const fetchAllFilterProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({filterParams,sortParams}) => {

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams
    });
    
    const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/list/?${query}`);
    return result.data;
  }
);
export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async ({id}) => {
    console.log(id);
const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/products/details/${id}`);
console.log(result,"result");
    return result.data;
  }
);


const ShoppingProductSlice = createSlice({
  name: "shoppingProduct",
  initialState,
  reducers: {
    setProductDetails:(state)=>{
      state.productDetails=null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilterProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilterProducts.fulfilled, (state, action) => {
        // console.log(action.payload,'actionpayload');
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilterProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      }).addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
         console.log(action.payload,'actionpayload');
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = ShoppingProductSlice.actions;

export default ShoppingProductSlice .reducer;
