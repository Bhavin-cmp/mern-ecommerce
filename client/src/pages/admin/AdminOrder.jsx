import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "../../redux/slices/orderSlice";
import { Link } from "react-router-dom";

const AdminOrder = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const filteredOrders = orders.filter((order) => {
    const userNameOrId = order.user?.userName || order.user?._id || "";
    const matchesUser = userNameOrId
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus = status ? order.status === status : true;
    const matchesDate = date ? order.createdAt.slice(0, 10) === date : true;
    return matchesUser && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    if (!newStatus) return;
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        📦 Manage Orders
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search by User"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-black border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-black border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-52"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border text-black border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-52"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center text-lg text-blue-600 font-semibold">
          Loading orders...
        </div>
      ) : error ? (
        <div className="text-red-600 font-medium">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow">
            <thead className="bg-gray-100 text-gray-800 font-semibold text-left">
              <tr>
                <th className="py-3 px-5">#</th>
                <th className="py-3 px-5">Order ID</th>
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Total</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredOrders.map((order, index) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-5">{index}</td>
                  <td className="py-3 px-5">{order._id}</td>
                  <td className="py-3 px-5">{order.user?.fullName}</td>
                  <td className="py-3 px-5">{order.createdAt.slice(0, 10)}</td>
                  <td className="py-3 px-5">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-5">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-5 text-center">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No orders found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrder;
