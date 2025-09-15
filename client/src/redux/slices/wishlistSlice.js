import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUserToken } from "../../utils/auth";

export const fetchWishList = createAsyncThunk(
  "wishList/fetchWishList",
  async (userId) => {
    // console.log("wishlist slice top");
    try {
      const response = await axios.get(
        `http://localhost:8000/api/wishList/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // console.log("WishList Response for fetch", response);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("Failed to fetch wishlist");
    } catch (error) {
      console.log("Error While Fetching wishlist", error);
      throw error;
    }
  }
);

export const addToWishList = createAsyncThunk(
  "wishList/addToWishList",
  async ({ productId }) => {
    // console.log("AddToWishListSlice", userId, productId);
    try {
      const token = getUserToken(); // ✅ get token from storage

      const response = await axios.post(
        `http://localhost:8000/api/wishList/add/${productId}`,
        {}, // no body (just hitting the endpoint with productId param)
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ send token
          },
        }
      );
      if (response.data.success) {
        return response.data.data;
      }
      return response.data;
      throw new error("failed to add to wishList");
    } catch (error) {
      console.log("Error while adding to wishlist", error);
      throw error;
    }
  }
);

export const removeFromWishList = createAsyncThunk(
  "wishList/removeFromWishList",
  async ({ productId }) => {
    try {
      const token = getUserToken();

      const response = await axios.delete(
        `http://localhost:8000/api/wishList/remove/${productId}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error("failed to remove from wishList");
    } catch (error) {
      console.log("Error While removing item from wishlist", error);
      throw error;
    }
  }
);

const whishListSlice = createSlice({
  name: "wishList",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    loading: false,
  },
  reducer: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishList.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishList.fulfilled, (state, action) => {
        state.status = "Succeeded";
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(addToWishList.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishList.fulfilled, (state, action) => {
        state.status = "Succeeded";
        state.items.push(action.payload);
        // state.items = action.payload;
        state.loading = false;
      })

      .addCase(addToWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(removeFromWishList.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishList.fulfilled, (state, action) => {
        const removedId = action.payload._id || action.payload; // handle both cases
        state.items = state.items.filter((item) => item._id !== removedId);
      })
      .addCase(removeFromWishList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

/* export const { addToWishList, removeFromWishList, fetchWishList } =
  whishListSlice.actions; */

export default whishListSlice.reducer;
