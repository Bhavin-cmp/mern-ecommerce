const HeroBanner = () => {
  return (
    <div className="relative bg-gradient-to-r from-sky-800 to-sky-500 text-white h-[60vh] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          Welcome to ShopEase
        </h1>
        <p className="text-lg sm:text-xl mb-6">
          Discover the latest trends and best deals!
        </p>
        <button className="bg-white text-sky-700 font-semibold px-6 py-3 rounded-full shadow hover:bg-sky-100 transition">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
