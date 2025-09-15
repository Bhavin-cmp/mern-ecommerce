import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById } from "../redux/slices/userSlice";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.users);
  const { orders } = useSelector((state) => state.userOrders);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      console.error("User not logged in");
      return;
    }
    dispatch(fetchUserById(userInfo.user.id));
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // console.log("user arrayyyyyyyyyyyyyy", orders);

  const userOrders = orders?.filter((order) => order?.user === user?._id);
  const totalOrders = userOrders?.length || 0;
  const totalReviews = user?.reviews?.length || 0;
  const recentOrders = userOrders?.slice(-3).reverse();
  const recentReviews = user?.reviews?.slice(-3).reverse();

  if (loading) {
    return (
      <p className="text-center text-blue-600 animate-pulse">Loading...</p>
    );
  }
  if (error) {
    return <p className="text-center text-red-600">{error}</p>;
  }
  if (!user) {
    return (
      <p className="text-center text-gray-600">User data not available.</p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-sky-800 mb-10">
        User Profile
      </h1>

      {loading ? (
        <p className="text-center text-blue-600 animate-pulse">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-10 bg-white shadow-lg rounded-2xl p-8">
          <div className="text-center">
            <img
              src={
                user.profileImage && user.profileImage.length > 0
                  ? user.profileImage
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.fullName || user.userName
                    )}&background=0D8ABC&color=fff&size=128`
              }
              alt="avatar"
              className="w-32 h-32 rounded-full mx-auto border-4 border-sky-500 shadow-md"
            />
            <h2 className="mt-4 text-xl font-bold text-gray-800">
              {user.fullName}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              DOB: {new Date(user.dob).toLocaleDateString()}
            </p>
            <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              {user.isAdmin ? "Admin User" : "Regular User"}
            </span>

            <Link
              to="/profile/edit"
              className="block mt-6 bg-blue-600 !text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Profile
            </Link>
            <Link
              to="/profile/password"
              className="block mt-3 bg-gray-600 !text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Update Password
            </Link>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-sky-800 mb-4">
              User Summary
            </h3>
            <ul className="space-y-3 text-gray-700 text-sm">
              <li>
                <strong>Username:</strong> {user.userName}
              </li>
              <li>
                <strong>Registered On:</strong>{" "}
                {new Date(user.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </li>
              <li>
                <strong>Total Orders Placed:</strong> {totalOrders}
              </li>
              <li>
                <strong>Total Reviews Written:</strong> {totalReviews}
              </li>
              <li>
                <strong>Address:</strong>
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="mt-1">
                    {user.addresses.map((addr, idx) => (
                      <div
                        key={addr._id || idx}
                        className="border rounded p-2 mt-1 bg-gray-50"
                      >
                        {addr.address}, {addr.city}, {addr.postalCode},{" "}
                        {addr.country}
                      </div>
                    ))}
                  </div>
                ) : (
                  " No address available"
                )}
              </li>
              <li>
                <strong>Account Status:</strong>{" "}
                {user.blocked ? (
                  <span className="text-red-500">Blocked</span>
                ) : (
                  <span className="text-green-600">Active</span>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}

      {recentOrders && recentOrders?.length > 0 ? (
        <div className="mt-10">
          <h3 className="text-4xl font-semibold text-sky-600 mb-6 underline">
            Recent Orders
          </h3>
          <ul className="grid gap-3">
            {recentOrders.map((order) => (
              <li
                key={order._id}
                className="border text-black p-4 rounded-lg shadow text-sm font-semibold bg-white"
              >
                Order ID: <strong className="text-sky-800">{order._id}</strong>
                <br />
                Date: {new Date(order.createdAt).toLocaleDateString()}
                <br />
                Total: ₹{Number(order.totalPrice).toLocaleString("en-IN")} -
                Status:{" "}
                <span
                  className={
                    "capitalize font-medium " +
                    (order.status === "pending"
                      ? "text-yellow-500"
                      : order.status === "shipped"
                      ? "text-blue-600"
                      : order.status === "delivered"
                      ? "text-green-600"
                      : order.status === "cancelled"
                      ? "text-red-600"
                      : "")
                  }
                >
                  {order.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10"> No Order Data</p>
      )}

      {recentReviews?.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-sky-800 mb-4">
            Recent Reviews
          </h3>
          <ul className="grid gap-3">
            {recentReviews.map((review, index) => (
              <li
                key={index}
                className="border p-4 rounded-lg shadow text-sm bg-white"
              >
                <div className="font-semibold">
                  Product: {review.productName}
                </div>
                <div>Rating: {review.rating} / 5</div>
                <div className="text-gray-600">{review.comment}</div>
                <div className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
