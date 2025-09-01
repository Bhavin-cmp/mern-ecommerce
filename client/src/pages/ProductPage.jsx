import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../redux/slices/productSlice";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(({ product }) => product);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory
      ? product.category.toLowerCase() === selectedCategory.toLowerCase()
      : true;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filter dropdown
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="relative inline-block mx-auto mb-10">
        <h1 className="text-3xl font-bold text-sky-300 px-8 py-4 border-4 border-sky-500 rounded-full relative text-center">
          Latest Products
        </h1>

        {/* Glowing Moving Dot */}
        {/* <span className="absolute w-3 h-3 bg-sky-500 rounded-full shadow-lg animate-spin-dot"></span> */}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-sky-300 rounded px-4 py-2 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-sky-300 rounded px-4 py-2 w-full sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <p className="text-blue-500 animate-pulse">Loading...</p>
      ) : error ? (
        <p className="text-red-500">
          {error || "An unexpected error occurred."}
        </p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductPage;
