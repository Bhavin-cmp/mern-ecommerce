import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import PaymentButton from "../components/PaymentButton";

const UserOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, loading, error } = useSelector((state) => state.userOrders);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, isLoggedIn, navigate]);

  return (
    <div className="max-w-5xl mx-auto mt-12 px-6">
      <h2 className="text-3xl font-bold text-sky-800 mb-8 border-b pb-3">
        My Orders
      </h2>

      {/* Loading & Error */}
      {loading && <div className="text-blue-500">Loading your orders...</div>}
      {error && <div className="text-red-500 font-medium">{error}</div>}
      {orders.length === 0 && !loading && (
        <div className="text-gray-500">You have not placed any orders yet.</div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:border-sky-500 transition-all"
          >
            {/* Order Header */}
            <div className="flex flex-wrap justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Order{" "}
                <span className="text-sm text-gray-500">
                  #{order._id.slice(-6)}
                </span>
              </h3>

              <div className="flex gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium
                    ${
                      order.status === "pending" &&
                      "bg-yellow-100 text-yellow-700"
                    }
                    ${order.status === "shipped" && "bg-blue-100 text-blue-700"}
                    ${
                      order.status === "delivered" &&
                      "bg-green-100 text-green-700"
                    }
                    ${order.status === "cancelled" && "bg-red-100 text-red-700"}
                  `}
                >
                  Order is :{" "}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Payment Pending"}
                </span>
              </div>
            </div>

            {/* Products */}
            <div className="mb-3">
              <h4 className="text-gray-700 font-medium mb-1">Products:</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm">
                {order.orderItems.map((item) => (
                  <li key={item._id}>
                    <Link
                      to={`/product/${item.product}`}
                      className="text-blue-600 hover:underline"
                    >
                      {item.name}
                    </Link>{" "}
                    × {item.qty}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div className="text-gray-700 mb-4">
              <span className="font-semibold">Total:</span>{" "}
              <span className="text-lg font-bold text-sky-800">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                to={`/order/${order._id}`}
                className="inline-block text-sm !text-white bg-sky-600 hover:bg-sky-700 px-4 py-2 rounded-lg transition"
              >
                View Details
              </Link>
              {order.paymentMethod === "cod" && !order.isPaid && (
                <PaymentButton
                  amount={order.totalPrice}
                  orderId={order._id}
                  onSuccess={() => dispatch(fetchUserOrders())}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrder;
