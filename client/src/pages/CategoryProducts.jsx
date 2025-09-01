import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";

const CategoryProducts = () => {
  const { categoryName } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(({ product }) => product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Gradient Header */}
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-sky-700 mb-2 relative inline-block">
          <span className="border-b-4 border-sky-500">
            {categoryName} Products
          </span>
        </h2>
        <p className="text-gray-400 mt-2">
          Explore the best of {categoryName} collection.
        </p>
      </div>

      {loading && (
        <p className="text-center text-blue-600 animate-pulse text-lg">
          Loading products...
        </p>
      )}

      {error && <p className="text-center text-red-500 font-medium">{error}</p>}

      {!loading && filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          No products available in "{categoryName}" category yet.
        </p>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;
