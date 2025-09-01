import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        "http://localhost:8000/api/orders",
        // "http://192.168.1.7:8000/api/orders",
        // "http://192.168.113.93:8000/api/orders",
        orderData,
        config
      );
      return data;
    } catch (error) {
      console.log("Error in CreateOrder", error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:8000/api/orders",
        // "http://192.168.1.7:8000/api/orders",
        // "http://192.168.113.93:8000/api/orders",
        config
      );
      // console.log("All Orders Slice Result ===>", data);
      return data.orders;
    } catch (error) {
      console.log("Error Fetching Orders", error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { getState, rejectWithValue }) => {
    try {
      // console.log("order Slice");
      const {
        auth: { userInfo },
      } = getState();
      console.log("user infor tpoekn", userInfo.token);
      const { data } = await axios.get(
        "http://localhost:8000/api/orders/myorders",
        // "http://192.168.1.7:8000/api/orders/myorders",
        // "http://192.168.113.93:8000/api/orders/myorders",
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      // console.log("User Order slice result ===>", data);
      return data.orders;
    } catch (error) {
      console.log("Error Fetching User Order Details", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();
      const { data } = await axios.put(
        `http://localhost:8000/api/orders/${id}/status`,
        // `http://192.168.1.7:8000/api/orders/${id}/status`,
        // `http://192.168.113.93:8000/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      console.log("Update Order Status =======", data);
      return data;
    } catch (error) {
      console.log("Error in Update Order Status", error);
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const userOrdersSlice = createSlice({
  name: "userOrders",
  initialState: { orders: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    orders: [],
    error: null,
    loading: false,
    success: false,
  },
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.error = null;
      state.loading = false;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
export const userOrdersReducer = userOrdersSlice.reducer;
