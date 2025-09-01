import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all products
export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/products");
      // const { data } = await axios.get("http://192.168.1.7:8000/api/products");
      /* const { data } = await axios.get(
        "http://192.168.113.93:8000/api/products"
      ); */
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Products"
      );
    }
  }
);

// fetch product by category
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (category, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/products/category/${category}`
        // `http://192.168.1.7:8000/api/products/category/${category}`
        // `http://192.168.113.93:8000/api/products/category/${category}`
      );
      // console.log("Product By Category Data", data);
      return data;
    } catch (error) {
      console.log("Error While Fetching products by category", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "failed to fetch the products by category"
      );
    }
  }
);

// Create a new product (admin)
export const createProduct = createAsyncThunk(
  "products/create",
  async (productData, { getState, rejectWithValue }) => {
    // console.log("Product Data", productData);
    try {
      const {
        auth: { userInfo },
      } = getState();
      const { data } = await axios.post(
        "http://localhost:8000/api/products",
        // "http://192.168.1.7:8000/api/products",
        // "http://192.168.113.93:8000/api/products",
        productData,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // console.log("dataaaaaaaa", data);
      return data;
    } catch (error) {
      console.log("Failed while creating Product", error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// Update a product (admin)
export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, productData }, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();
      const { data } = await axios.put(
        `http://localhost:8000/api/products/${id}`,
        // `http://192.168.113.93:8000/api/products/${id}`,
        productData,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Delete a product (admin)
export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { getState, rejectWithValue }) => {
    try {
      const {
        auth: { userInfo },
      } = getState();
      await axios.delete(`http://localhost:8000/api/products/${id}`, {
        // await axios.delete(`http://192.168.113.93:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

/* Bulk Product Upload */

export const bulkCreateProducts = createAsyncThunk(
  "products/bulkCreate",
  async (products, { getState, rejectWithValue }) => {
    console.log("Producstssss", products);
    try {
      const {
        auth: { userInfo },
      } = getState();
      const { data } = await axios.post(
        "http://localhost:8000/api/products/bulk",
        // "http://192.168.113.93:8000/api/products/bulk",
        { products },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Bulk daata", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Bulk upload failed"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    productsByCategory: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.success = true;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something Went Wrong";
        state.products = [];
      })
      // Create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create product";
      })
      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.map((prod) =>
          prod._id === action.payload._id ? action.payload : prod
        );
        state.success = true;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update product";
      })
      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (prod) => prod._id !== action.payload
        );
        state.success = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete product";
      })
      .addCase(bulkCreateProducts.fulfilled, (state, action) => {
        state.products = [...state.products, ...action.payload];
        state.loading = false;
        state.success = true;
      })
      .addCase(bulkCreateProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(bulkCreateProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.productsByCategory = action.payload;
        state.loading = false;
        state.success = true;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      });
  },
});

export default productSlice.reducer;
