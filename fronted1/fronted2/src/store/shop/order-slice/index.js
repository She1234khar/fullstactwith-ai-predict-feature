import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"


const initialState = {
  orderId: null,
  isLoading: false,
  approvalURL: null,
  orderList: [],
  orderDetails: null,
}

export const createNewOrder =createAsyncThunk('/order/createNewOrder',async (orderData)=>{
  const response= await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/create`,orderData)

  return response.data;

})


export const capturePayment =createAsyncThunk('/order/capturePayment',async ({paymentId,payerId,orderId})=>{
  const response= await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/capture`,{paymentId,payerId,orderId})

  return response.data;

})

export const getAllOrdersByUserId =createAsyncThunk('/order/getAllOrdersByUserId ',async (userId)=>{
  const response= await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`)

  return response.data;

})

export const getOrderDetails=createAsyncThunk('/order/getOrderDetails ',async (id)=>{
  const response= await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`)

  return response.data;

})

export const cancelOrder =createAsyncThunk('/order/cancelOrder ',async (orderId)=>{
  const response= await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/cancel`,{orderId})

  return response.data;

})





const shoppingOrderSlice=createSlice({
  name:'shoppingOrderSlice',
  initialState,
  reducers: {
    resetOrderState: (state) => {
      
      state.orderDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderId = action.payload.orderId;
        state.approvalURL = action.payload.approvalURL;
        sessionStorage.setItem('currentOrderId',JSON.stringify(action.payload.orderId));
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.orderId = null;
        state.approvalURL = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;  
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;    
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
        })
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.orderList.length > 0) {
          const orderIndex = state.orderList.findIndex(order => order._id === action.payload.data._id);
          if (orderIndex !== -1) {
            state.orderList[orderIndex] = action.payload.data;
          }
        }
      })
      .addCase(cancelOrder.rejected, (state) => {
        state.isLoading = false;
        })
  }
});

export const { resetOrderState } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;