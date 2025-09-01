import { Link, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const renderRating = () => (
    <div className="flex items-center text-sm mt-1">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          className={i < product.rating ? "text-yellow-400" : "text-gray-300"}
        />
      ))}
      <span className="ml-2 text-gray-500">({product.numReviews})</span>
    </div>
  );

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Please login to add items to the cart");
      navigate("/login");
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition flex flex-col group">
      <Link
        to={`/product/${product._id}`}
        className="w-full h-56 bg-gray-100 rounded-xl mb-4 overflow-hidden flex items-center justify-center"
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
      </Link>

      <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 mb-1">
        {product.name}
      </h3>

      <p className="text-sky-700 font-bold text-md mb-3">
        ₹{Number(product.price).toLocaleString("en-IN")}
      </p>

      {renderRating()}

      <div className="mt-auto flex gap-3 pt-4">
        <Link
          to={`/product/${product._id}`}
          className="flex-1 text-center border border-sky-700 text-sky-700 font-medium px-3 py-2 rounded-lg hover:bg-sky-700 hover:text-white transition"
        >
          View Details
        </Link>
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-green-600 text-white font-medium px-3 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
