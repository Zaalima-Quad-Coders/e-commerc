import { configureStore } from "@reduxjs/toolkit";
import productReducer from '../features/products/productSlice.mjs'

export const store = configureStore({
    reducer : {
    product : productReducer
    }
})