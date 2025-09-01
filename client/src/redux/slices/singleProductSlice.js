import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProductbyId = createAsyncThunk(
  "product/fetchById",
  async (id, { rejectWithValue }) => {
    console.log("Fetch Product Id", id);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/products/${id}`
        // `http://192.168.1.7:8000/api/products/${id}`
        // `http://192.168.113.93:8000/api/products/${id}`
      );
      console.log("Product Slices signle", response);
      return response.data;
    } catch (error) {
      console.log("Error Fetching the Product By Id", error.message);
      return rejectWithValue(
        error.response?.data?.message || "Error Fetching Single Products"
      );
    }
  }
);

const singleProductSlice = createSlice({
  name: "singleProduct",
  initialState: {
    error: null,
    loading: false,
    product: null,
  },
  reducers: {
    resetSingleProduct: (state) => {
      state.error = null;
      state.loading = false;
      state.product = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchProductbyId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductbyId.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductbyId.rejected, (state, action) => {
        state.error = action.payload || "An unexpected Error Occured";
        state.loading = false;
      }),
});

export const { resetSingleProduct } = singleProductSlice.actions;
export default singleProductSlice.reducer;
