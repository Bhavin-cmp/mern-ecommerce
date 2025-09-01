import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import singleProductreducer from "./slices/singleProductSlice";
import cartReducer from "./slices/cartSlice";
import orderReducer, { userOrdersReducer } from "./slices/orderSlice";
import addressReducer from "./slices/addressSlice";
import reviewReducer from "./slices/reviewSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    singleProduct: singleProductreducer,
    cart: cartReducer,
    order: orderReducer,
    userOrders: userOrdersReducer,
    address: addressReducer,
    review: reviewReducer,
    users: userReducer,
  },
});
