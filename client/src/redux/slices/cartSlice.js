import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch cart from backend
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
    const { data } = await axios.get("http://localhost:8000/api/cart", config);
    // const { data } = await axios.get(
    // "http://192.168.1.7:8000/api/cart",
    // "http://192.168.113.93:8000/api/cart",
    // config
    // );
    console.log("fetched cart data", data);
    return data.cart.items;
  }
);

// Add or update item in cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, thunkAPI) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
    const { data } = await axios.post(
      "http://localhost:8000/api/cart",
      // "http://192.168.1.7:8000/api/cart",
      // "http://192.168.113.93:8000/api/cart",
      {
        productId,
        quantity,
      },
      config
    );
    // Ensure backend returns { items: [...] }
    return data.cart.items;
  }
);
// Remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, thunkAPI) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
    const { data } = await axios.post(
      "http://localhost:8000/api/cart/remove",
      // "http://192.168.1.7:8000/api/cart/remove",
      // "http://192.168.113.93:8000/api/cart/remove",
      { productId },
      config
    );
    return data.cart.items;
  }
);

// Clear cart
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
    await axios.post("http://localhost:8000/api/cart/clear", {}, config);
    // await axios.post("http://192.168.1.7:8000/api/cart/clear", {}, config);
    // await axios.post("http://192.168.113.93:8000/api/cart/clear", {}, config);
    return [];
  }
);

// Update cart item quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async ({ productId, quantity }, thunkAPI) => {
    const token = localStorage.getItem("token");
    // console.log("update cart slice dataaaa", productId, quantity);
    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
    const { data } = await axios.post(
      "http://localhost:8000/api/cart",
      // "http://192.168.1.7:8000/api/cart",
      // "http://192.168.113.93:8000/api/cart",
      { productId, quantity },
      config
    );
    // console.log("update cart slice data", data);
    return data.cart.items;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add/Update Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Cart Item Quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload || [];
        state.error = null;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// export { fetchCart, addToCart, removeFromCart, clearCart };
export default cartSlice.reducer;
