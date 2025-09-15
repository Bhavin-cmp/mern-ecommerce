// src/pages/WishListPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishList,
  removeFromWishList,
} from "../redux/slices/wishlistSlice";
import { getUserId, isUserLoggedIn } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WishListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = getUserId();
  const isAuth = isUserLoggedIn();

  const { items, loading } = useSelector((state) => state.wishList);

  useEffect(() => {
    if (!isAuth) {
      navigate("/login");
    } else {
      dispatch(fetchWishList(userId));
    }
  }, [dispatch, userId, isAuth, navigate]);

  const handleRemove = async (productId) => {
    await dispatch(removeFromWishList({ productId }));
    dispatch(fetchWishList(userId)); // Refresh after removal
    toast.success("product Removed From WishList");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

      {loading ? (
        <p>Loading wishlist...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((product) => (
            <div
              key={product._id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition relative"
            >
              <button
                onClick={() => handleRemove(product._id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>

              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <p className="text-sky-700 font-bold mt-2">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishListPage;
