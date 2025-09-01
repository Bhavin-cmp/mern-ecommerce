import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllUser = createAsyncThunk("user/fetchAllUser", async () => {
  try {
    const response = await axios.get(
      "http://localhost:8000/api/users/fetchUser",
      // "http://192.168.1.7:8000/api/users/fetchUser",
      // "http://192.168.113.93:8000/api/users/fetchUser",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("User response", response);
    if (response.status === 200) {
      return response.data.users;
    } else {
      throw new Error("Failed to fetch users");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
});

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/fetchUserById/${userId}`,
        // `http://192.168.1.7:8000/api/users/fetchUserById/${userId}`,
        // `http://192.168.113.93:8000/api/users/fetchUserById/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // console.log("userdata by id resposnse", response.data);
      if (response.status === 200) {
        return response.data.user;
      } else {
        throw new Error("Failed to fetch User data by id");
      }
    } catch (error) {
      console.log("Error While fetching the user data", error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch user by ID"
      );
    }
  }
);

export const blockUser = createAsyncThunk(
  "user/blockuser",
  async ({ userId, days }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/users/${userId}/block`,
        // `http://192.168.1.7:8000/api/users/${userId}/block`,
        // `http://192.168.113.93:8000/api/users/${userId}/block`,
        { days },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { userId, ...response.data };
    } catch (error) {
      console.error("Error blocking user:", error);
      return (
        rejectWithValue(error.response?.data?.message) || "Failed to block user"
      );
    }
  }
);

export const unblockUser = createAsyncThunk(
  "users/unblockUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/users/${userId}/unblock`,
        // `http://192.168.1.7:8000/api/users/${userId}/unblock`,
        // `http://192.168.113.93:8000/api/users/${userId}/unblock`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return { userId, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unblock user"
      );
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(blockUser.fulfilled, (state, action) => {
        // Optionally update the user in state.users
        const idx = state.users.findIndex(
          (u) => u._id === action.payload.userId
        );
        if (idx !== -1) {
          state.users[idx].blocked = true;
          state.users[idx].blockExpires = action.payload.blockExpires;
        }
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // <-- store the fetched user here
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default userSlice.reducer;
