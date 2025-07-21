import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"
const initialState ={
  isLoading:false,
  productList :[]
}
  export const addNewProduct=createAsyncThunk("/products/addnewproduct",async(FormData)=>{
    const result=await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/products/add`,FormData,{
      headers: {
        'Content-Type': 'application/json'
      }
  })
  return result.data;
  })

  export const fetchAllProducts=createAsyncThunk("/products/fetchAllProducts",async()=>{
    const result=await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/products/fetch`
  )
  return result.data;
  })

  export const editProduct=createAsyncThunk("/products/editProduct",async({id,formData})=>{
    const result=await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/products/edit/${id}`,formData,{
    headers:{
      'Content-Type': 'application/json'
    }
  })
  return result.data;
  })

  export const deleteProduct=createAsyncThunk("/products/deleteProduct",async({ id})=>{
    const result=await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/products/delete/${id}`,
  )
  return result.data;
  })

//console.log(action.payload);
const adminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState,
  reducers: {},
extraReducers:(builder)=>{
  builder.addCase(fetchAllProducts.pending,(state)=>{
    state.isLoading=true;
  }).addCase(fetchAllProducts.fulfilled,(state,action)=>{
    console.log(action.payload);
    state.isLoading=false;
    state.productList=action.payload.listofproduct;
  }).addCase(fetchAllProducts.rejected,(state)=>{
    state.isLoading=false;
    state.productList=[];
  })
}

})
export default adminProductsSlice.reducer;




//4:13
