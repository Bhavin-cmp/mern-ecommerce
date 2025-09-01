import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addReview = createAsyncThunk(
  "review/addReview",
  async ({ productId, rating, comment }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();
      await axios.post(
        `http://localhost:8000/api/products/${productId}/reviews`,
        // `http://192.168.1.7:8000/api/products/${productId}/reviews`,
        // `http://192.168.113.93:8000/api/products/${productId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      return { success: true };
    } catch (error) {
      console.log("Error while review product");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetReview: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addReview.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReview } = reviewSlice.actions;
export default reviewSlice.reducer;
