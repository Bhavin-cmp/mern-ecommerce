import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAllUser } from "../../redux/slices/userSlice";
import { fetchOrders } from "../../redux/slices/orderSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { useState } from "react";

const AdminDashBoard = () => {
  const dispatch = useDispatch();
  const [pendingOrders, setPendingOrders] = useState();
  const { users } = useSelector((state) => state.users);
  const { orders } = useSelector((state) => {
    // console.log("states", state);
    return state.order;
  });

  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchAllUser());
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, []);

  //calculate pending orders list
  useEffect(() => {
    const pending = orders?.filter((order) => order.status === "pending");
    setPendingOrders(pending.length);
  }, [orders]);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-blue-800">{users.length}</div>
          <div className="text-gray-700">Total Users</div>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-blue-800">
            {orders.length}
          </div>
          <div className="text-gray-700">Total Orders</div>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-blue-800">123</div>
          <div className="text-gray-700">Total Sales</div>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-blue-800">
            {products?.length}
          </div>
          <div className="text-gray-700">Total Products</div>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <div className="text-2xl font-bold text-blue-800">
            {pendingOrders}
          </div>
          <div className="text-gray-700">Pending Order</div>
        </div>
        {/* Repeat for Orders, Sales, Products, etc. */}
      </div>
      <div className="header max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-12">
        <h1 className="text-3xl font-bold text-sky-900 mb-8 text-center shadow-lg">
          Admin Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link
            to="/admin/products"
            className="bg-sky-800 hover:bg-sky-900 !text-white py-4 px-6 rounded text-xl font-semibold text-center transition shadow-lg shadow-sky-400/60"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/adminDashboard/adminUser"
            className="bg-sky-800 hover:bg-sky-900 !text-white py-4 px-6 rounded text-xl font-semibold text-center transition shadow-lg shadow-sky-400/60"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/adminDashboard/adminOrder"
            className="bg-sky-800 hover:bg-sky-900 !text-white py-4 px-6 rounded text-xl font-semibold text-center transition shadow-lg shadow-sky-400/60"
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/review"
            className="bg-sky-800 hover:bg-sky-900 !text-white py-4 px-6 rounded text-xl font-semibold text-center transition shadow-lg shadow-sky-400/60"
          >
            Manage Reviews
          </Link>
          <Link
            to="/admin/products/BulkProductUpload"
            className="bg-sky-800 hover:bg-sky-900 !text-white py-4 px-6 rounded text-xl font-semibold text-center transition shadow-lg shadow-sky-400/60"
          >
            Bulk Product Upload
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoard;
