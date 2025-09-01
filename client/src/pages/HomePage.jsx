import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import HeroBanner from "../components/HeroBanner";
import CategoriesGrid from "../components/CategoriesGrix";
import HomeSlider from "../components/HomeSlicer";

const HomePage = () => {
  const dispatch = useDispatch();
  const [sortBy, setSortBy] = useState("");
  const [category, setCategory] = useState("");
  const { products, loading, error } = useSelector(({ product }) => product);

  //Local loading for filtering
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  //add a small delay to simulate filtering loading
  useEffect(() => {
    if (category || sortBy) {
      setFiltering(true);
      const timer = setTimeout(() => setFiltering(false), 400);
      return () => clearTimeout(timer);
    }
  }, [category, sortBy]);

  let filteredProducts = products;

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter((p) => p.category === category);
  }

  // Sort
  if (sortBy === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortBy === "name-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="slider mb-10 ">
        {/* <HeroBanner /> */}
        <HomeSlider />
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Shop by Category
        </h2>
        <CategoriesGrid />
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 md:grid-cols-3 items-center justify-center gap-4 mb-6 border-black">
          <select
            value={sortBy}
            className="border-black border px-2 py-1 rounded text-black"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
          <h2 className="text-3xl font-extrabold text-sky-900  text-center">
            Featured Products
          </h2>
          <select
            className="border border-black px-2 py-1 rounded text-black"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {/* Replace with your real categories */}
            <option value="Electronics">Electronics</option>
            <option value="Clothes">Clothes</option>
            <option value="Book">Books</option>
            <option value="Women Accessories">Women Accessories</option>
            <option value="Men Accessories">Men Accessories</option>
            <option value="Sports">Sports</option>
            <option value="Kitchen">Kitchen</option>
            <option value="House">House</option>
          </select>
        </div>
        {(loading || filtering) && (
          <p className="text-center text-gray-600">Loading products...</p>
        )}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !filtering && filteredProducts.length === 0 && (
          <p className="text-center text-gray-500">
            {category
              ? `No products available in "${category}" category yet.`
              : "No products available."}
          </p>
        )}

        <div className="homepageContainer grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {!loading &&
            !filtering &&
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
