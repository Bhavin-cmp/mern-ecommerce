// Example: ProductDetails.jsx
import { useDispatch, useSelector } from "react-redux";
import { addReview, resetReview } from "../redux/slices/reviewSlice";
import { useState } from "react";
import { toast } from "react-toastify";

const ProductReviews = ({ product }) => {
  if (!product) return null;

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.review);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      toast.error("Please provide rating and comment");
      return;
    }
    await dispatch(addReview({ productId: product._id, rating, comment }));
    dispatch(resetReview());
    setRating(0);
    setComment("");
    toast.success("Review submitted!");
  };

  return (
    <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
        Reviews
      </h3>

      {/* No Reviews */}
      {product.reviews.length === 0 && (
        <div className="text-gray-500 italic mb-4">No reviews yet.</div>
      )}

      {/* Reviews List */}
      <ul className="space-y-4">
        {product.reviews.map((r) => (
          <li
            key={r._id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-gray-800">{r.name}</span>
              <span className="text-sm text-yellow-500 font-medium">
                ⭐ {r.rating} / 5
              </span>
            </div>
            <p className="text-gray-700 mb-2">{r.comment}</p>
            <div className="text-xs text-gray-400">
              {new Date(r.createdAt).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>

      {/* Review Form */}
      {userInfo ? (
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <h4 className="text-lg font-semibold text-gray-800">
            Write a Review
          </h4>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review"
              className="border border-gray-300 rounded-md px-3 py-2 h-24 resize-none text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>

          {error && <div className="text-red-500 text-sm">{error}</div>}
        </form>
      ) : (
        <div className="mt-4 text-gray-500 italic">
          Please <span className="font-semibold text-blue-600">log in</span> to
          write a review.
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
