import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductbyId } from "../redux/slices/singleProductSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import { addToCart } from "../redux/slices/cartSlice";
import ProductReviews from "./ProductReview";
import { QRCodeSVG } from "qrcode.react";
import { fetchProductsByCategory } from "../redux/slices/productSlice";
import { useState } from "react";

const ProductDetailsPage = () => {
  const [descExpanded, setDescExpanded] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading, error } = useSelector(
    (state) => state.singleProduct
  );
  const productsByCategory = useSelector((state) =>
    Array.isArray(state.product.productsByCategory?.products)
      ? state.product.productsByCategory.products
      : []
  );

  const isLoggedIn = !!localStorage.getItem("token");

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Please login to add items to the cart");
      navigate("/login");
      return;
    }
    dispatch(addToCart({ productId: product._id, quantity: 1 }));
  };

  useEffect(() => {
    dispatch(fetchProductbyId(id)).catch((error) =>
      console.log("Fetch Error", error)
    );
  }, [dispatch, id]);

  useEffect(() => {
    if (product?.category) {
      dispatch(fetchProductsByCategory(product?.category)).catch((error) =>
        console.log("Fetch Products by Category Error", error)
      );
    }
  }, [dispatch, product?.category]);

  if (loading) return <p className="p-6 text-white">Loading...</p>;
  if (error) return <p className="text-red-500 p-6">{error}</p>;
  if (!product) return <p className="p-6 text-gray-500">No product found.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Product Image + Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Product Image */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex justify-center">
          <img
            src={product?.image || "/placeholder.png"}
            alt={product?.name}
            className="rounded-xl w-full max-h-[450px] object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="bg-gradient-to-br from-blue-900 to-cyan-700 rounded-2xl shadow-xl text-white p-8 space-y-6 border-b border-sky-400">
          <h1 className="!text-xl font-extrabold tracking-tight">
            {product?.name}
          </h1>

          <div>
            <p className="text-xl font-semibold mb-1">Description:</p>
            <p className="text-sm text-gray-200">
              {descExpanded || (product?.description?.length ?? 0) <= 200
                ? product?.description
                : `${product?.description?.slice(0, 200)}...`}
              {product?.description?.length > 200 && (
                <button
                  className="ml-2 text-blue-300 underline !border-none !bg-transparent !focus:outline-none"
                  onClick={() => setDescExpanded((prev) => !prev)}
                >
                  {descExpanded ? "Show less" : "Read more"}
                </button>
              )}
            </p>
          </div>

          <div className="text-2xl font-bold text-green-400">
            <span className="text-white">Price: </span>₹
            {Number(product.price).toLocaleString("en-IN")}
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-4">
            <div className="flex items-center text-yellow-400">
              <svg
                className="w-5 h-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118l-3.388-2.46c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z" />
              </svg>
              <span className="font-semibold">{product?.rating} / 5</span>
            </div>
            <span className="text-sm text-gray-300">
              {product?.numReviews} review{product?.numReviews !== 1 && "s"}
            </span>
          </div>

          {/* Stock Status */}
          <p className="text-md">
            <span className="font-semibold">Status: </span>
            <span
              className={
                product?.countInStock > 0
                  ? "text-green-300 font-medium"
                  : "text-red-400 font-medium"
              }
            >
              {product?.countInStock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          {/* QR Code */}
          <div className="flex flex-col items-center mt-4">
            <span className="text-sm mb-2">Scan to view in AR</span>
            <QRCodeSVG
              value={`http://192.168.113.93:5173/ar/${product._id}`}
              size={128}
              bgColor="#fff"
              fgColor="#000"
            />
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product?.countInStock === 0}
            className={`mt-4 px-6 py-3 rounded-lg font-semibold shadow-md transition duration-200 ${
              product?.countInStock > 0
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Product Reviews */}
      <div className="bg-white text-gray-900 rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          Product Reviews
        </h2>
        <ProductReviews product={product} />
      </div>

      {/* Related Products */}
      <div className="relatedProducts">
        <h3 className="text-2xl font-bold text-blue-700 mb-4">
          Related Products
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {productsByCategory
            .filter((prod) => prod._id !== product._id)
            .map((prod) => (
              <Link
                to={`/product/${prod._id}`}
                key={prod._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 p-4 text-center"
              >
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-32 w-full object-contain mb-3 group-hover:scale-105 transition-transform"
                />
                <div className="font-semibold text-gray-800 group-hover:text-blue-600">
                  {prod.name}
                </div>
                <div className="text-green-600 font-bold mt-1">
                  ₹{Number(prod.price).toLocaleString("en-IN")}
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
