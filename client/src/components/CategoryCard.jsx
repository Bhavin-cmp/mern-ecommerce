const CategoryCard = ({ title, image }) => {
  return (
    <div className="border p-4 rounded-xl shadow hover:shadow-md transition text-center">
      <img
        src={image}
        alt={title}
        className="h-24 mx-auto mb-2 object-contain"
      />
      <h3 className="font-semibold">{title}</h3>
    </div>
  );
};

export default CategoryCard;
