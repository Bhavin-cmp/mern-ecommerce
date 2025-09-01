import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ userName, password }, { rejectWithValue }) => {
    console.log("login user slice", userName, password);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/login",
        // "http://192.168.1.7:8000/api/users/login",
        // "http://192.168.113.93:8000/api/users/login",
        {
          userName,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userInfo", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log("Login Error", error);
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/users/register",
        // "http://192.168.1.7:8000/api/users/register",
        // "http://192.168.113.93:8000/api/users/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("register Data", response);

      localStorage.setItem("userInfo", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.log("Registration Error", error);
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("token");
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something Went Wrong";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error - null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
