import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../features/products/productSlice.mjs'
import userReducer from '../features/user/userSlice.mjs'

export const store = configureStore({
    reducer : {
    product : productReducer,
    user : userReducer
    }
})