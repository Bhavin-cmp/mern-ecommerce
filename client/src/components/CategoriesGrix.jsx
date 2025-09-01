import { Link } from "react-router-dom";
const categories = [
  { name: "Electronics", image: "/Image/Electronics.jpg" },
  { name: "Fashion", image: "/Image/Fashion.jpg" },
  { name: "Kitchen", image: "/Image/kitchen.jpg" },
  { name: "Book", image: "/Image/Books.jpg" },
  { name: "Beauty", image: "/Image/Beauty.png" },
  { name: "Sports", image: "/Image/sports.jpg" },
];

const CategoriesGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 shadow-lg">
      {categories.map((cat, index) => (
        <Link
          key={cat.name}
          to={`/category/${encodeURIComponent(cat.name)}`}
          className="text-center hover:scale-105 transition-transform duration-300 "
        >
          <div className="w-full h-28 rounded-lg overflow-hidden shadow-md">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-sky-800 mt-2 font-medium">{cat.name}</p>
        </Link>
      ))}
    </div>
  );
};

export default CategoriesGrid;
