import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddress",
  async (__, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };

      const { data } = await axios.get(
        "http://localhost:8000/api/addresses/addresses",
        // "http://192.168.1.7:8000/api/addresses/addresses",
        // "http://192.168.113.93:8000/api/addresses/addresses",

        config
      );
      //   console.log("address data response", data.addresses);
      return data.addresses;
    } catch (error) {
      console.log("Error fetching address", error.message);
    }
  }
);

// Add new address
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (address, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      };
      const { data } = await axios.post(
        "http://localhost:8000/api/addresses/addresses",
        // "http://192.168.1.7:8000/api/addresses/addresses",
        // "http://192.168.113.93:8000/api/addresses/addresses",
        address,
        config
      );
      return data.addresses;
    } catch (error) {
      console.log("Error Adding address slice", error.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update address
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ addressId, address }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();
      const { data } = await axios.put(
        `http://localhost:8000/api/addresses/${addressId}`,
        // `http://192.168.1.7:8000/api/addresses/${addressId}`,
        // `192.168.113.93:8000/api/addresses/${addressId}`,
        address,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      return data.addresses;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Delete address
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (addressId, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();
      const { data } = await axios.delete(
        `http://localhost:8000/api/addresses/addresses/${addressId}`,
        // `http://192.168.1.7:8000/api/addresses/addresses/${addressId}`,
        // `http://192.168.113.93:8000/api/addresses/addresses/${addressId}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      return data.addresses;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
