import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../redux/slices/productSlice";
import DataTable from "react-data-table-component";
import { deleteProduct } from "../../redux/slices/productSlice"; // make sure this exists

import { Pencil, Trash2 } from "lucide-react";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const { products, loading, error } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.auth);

  // Filtered products
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category ? prod.category === category : true;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (!userInfo?.user.isAdmin) {
      navigate("/login");
    } else {
      dispatch(fetchProducts());
    }
  }, [dispatch, userInfo, navigate]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteProduct(id));
    }
  };

  // Data Table colimns Define
  const columns = [
    { name: "#", selector: (row, i) => i + 1 },
    {
      name: "Product Image",
      cell: (row) => (
        <img
          src={row.image}
          alt={row.name}
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      right: true,
    },
    {
      name: "Stock",
      selector: (row) => row.countInStock,
      sortable: true,
      right: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <Link
            to={`/admin/products/edit/${row._id}`}
            className="w-24 flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 !text-white text-sm rounded shadow"
          >
            <Pencil size={14} /> Edit
          </Link>
          <button
            onClick={() => handleDelete(row._id)}
            className="w-24 flex items-center gap-1 px-3 py-1 !bg-orange-900 hover:bg-red-600 text-white text-sm rounded shadow"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Manage Products
        </h2>
        <span className="text-gray-600">
          Available Product is : {products.length}
        </span>

        <div className="flex items-center">
          <Link
            to="/admin/products/addNewProducts"
            className="bg-blue-600 hover:bg-blue-700 transition !text-white px-5 py-2 rounded-lg shadow"
            title="Add a single product"
          >
            + Add Product
          </Link>
          <Link
            to="/admin/products/BulkProductUpload"
            className="bg-green-600 hover:bg-green-700 !text-white px-5 py-2 rounded-lg shadow ml-4"
            title="Upload multiple products"
          >
            Bulk Upload
          </Link>
        </div>
      </div>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          name="searcg"
          placeholder="Search by name..."
          value={search}
          className="border px-3 py-2 rounded w-64 text-gray-700"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-3 py-2 rounded border-gray-600 text-black"
        >
          <option value="">All Categories</option>
          {[...new Set(products.map((p) => p.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="text-gray-600">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}

      {!loading && filteredProducts.length === 0 ? (
        <div className="text-gray-500 text-center py-8 text-lg">
          No products available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          {/* <table className="min-w-full bg-white border rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left py-3 px-4 w-12">#</th>
                <th className="text-left py-3 px-4 w-12">Product Image</th>
                <th className="text-center py-3 px-4">Name</th>
                <th className="py-3 px-4 text-center">Price</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Category</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredProducts.map((prod, index) => (
                <tr
                  key={prod._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4 text-left font-medium text-gray-500">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="py-3 px-4">{prod.name}</td>
                  <td className="py-3 px-4 text-center">${prod.price}</td>
                  <td className="py-3 px-4 text-center">{prod.countInStock}</td>
                  <td className="py-3 px-4 text-center capitalize">
                    {prod.category}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`/admin/products/edit/${prod._id}`}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 !text-white text-sm rounded shadow"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="flex items-center gap-1 px-3 py-1 !bg-orange-900 hover:bg-red-600 text-white text-sm rounded shadow"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
          <DataTable
            columns={columns}
            data={filteredProducts}
            progressPending={loading}
            pagination={true}
            highlightOnHover
            pointerOnHover
            noDataComponent="No products available."
          />
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
