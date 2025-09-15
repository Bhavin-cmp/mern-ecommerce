import { use, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import Address from "./pages/Address";
import AdminProducts from "./pages/admin/AdminProducts";
import AddNewProductPage from "./pages/admin/AddNewProductPage";
import BulkProductUpload from "./pages/admin/BulkProductUpload";
import AdminDashBoard from "./pages/admin/AdminDashBoard";
import AdminOrder from "./pages/admin/AdminOrder";
import { AdminUser } from "./pages/admin/AdminUser";
import CategoryProducts from "./pages/CategoryProducts";
import ARProductPage from "./pages/ARProductPage";
import UserOrder from "./pages/UserOrder";
import { fetchWishList } from "./redux/slices/wishlistSlice";
import { useDispatch } from "react-redux";
import WishListPage from "./pages/WishListPage";
import EditProfilePage from "./pages/EditProfilePage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userInfo");
    const userParseData = userData ? JSON.parse(userData) : null;

    // const userParseData = JSON.parse(userData);
    const userId = userParseData ? userParseData.user.id : null;
    if (token && userId) {
      dispatch(fetchWishList(userId));
    } else {
      console.log("No token or userId found in localStorage");
    }
  });

  return (
    <>
      <Router>
        <Header />
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-6">
          <ToastContainer position="top-right" autoClose={4000} />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product/" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/address" element={<Address />} />
            <Route path="/myOrders" element={<UserOrder />} />
            <Route path="/address" element={<Address />} />
            <Route path="/order/:id" element={<OrderDetailsPage />} />
            <Route path="/admin/adminDashboard" element={<AdminDashBoard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/wishList" element={<WishListPage />} />
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route
              path="/category/:categoryName"
              element={<CategoryProducts />}
            />
            <Route
              path="/admin/products/addNewProducts"
              element={<AddNewProductPage />}
            />
            <Route
              path="/admin/products/BulkProductUpload"
              element={<BulkProductUpload />}
            />
            <Route
              path="admin/adminDashboard/adminOrder"
              element={<AdminOrder />}
            />
            <Route
              path="/admin/adminDashboard/adminUser"
              element={<AdminUser />}
            />
            <Route path="/ar/:id" element={<ARProductPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
