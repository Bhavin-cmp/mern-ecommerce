const ProductCard = ({ product }) => {
  return (
    <div className="border rounded-xl p-4 shadow hover:shadow-md transition">
      <img
        src={product.image}
        alt={product.name}
        className="h-40 w-full object-cover rounded"
      />
      <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600">${product.price}</p>
    </div>
  );
};

export default ProductCard;
