import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice/slice'
import adminProductsSlice from './admin/product-slice'
import adminOrderSlice from './admin/order-slice'
import shopProductSlice from './shop/product-slice'
import shopCartsSlice from './shop/cart-slice'
import shopAddressSlice from './shop/address-slice'
import shopOrderSlice from './shop/order-slice'
import shopReviewSlice from './shop/review-slice'
import shopSearchSlice from './shop/search-slice'
import priceTrendSlice from './shop/price-trend-slice'


const store =configureStore({
  reducer :{
    auth:authReducer,
    adminProducts:adminProductsSlice,
    shoppingProduct :shopProductSlice,
    shoppingCart:shopCartsSlice,
    address:shopAddressSlice,
    shoppingOrderSlice:shopOrderSlice,
    adminOrder:adminOrderSlice,
    reviewSlice:shopReviewSlice,
    searchSlice:shopSearchSlice,
    priceTrendSlice:priceTrendSlice
  }      
})

export default store;