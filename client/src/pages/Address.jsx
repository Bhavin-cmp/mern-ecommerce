import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  deleteAddress,
  fetchAddresses,
  updateAddress,
} from "../redux/slices/addressSlice";

const loader = "../../public/Ripplr_Loader.gif";

const Address = () => {
  const dispatch = useDispatch();
  const { addresses, loading, error } = useSelector((state) => state.address);

  const [form, setForm] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    label: "",
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      const editAddresResultAction = await dispatch(
        updateAddress({ addressId: editId, address: form })
      );
      if (updateAddress.fulfilled.match(editAddresResultAction)) {
        toast.success("Address Update Successfully");
      } else {
        toast.error("Address Not Update");
      }
    } else {
      const addAddressResultAction = await dispatch(addAddress(form));
      if (addAddress.fulfilled.match(addAddressResultAction)) {
        toast.success("Address Added Successfully");
      } else {
        toast.error("Unable To Add Address, Please Try Again");
      }
    }
    setForm({ address: "", city: "", postalCode: "", label: "", country: "" });
  };

  const handleEdit = (addr) => {
    setForm(addr);
    setEditId(addr._id);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (confirmDelete) {
      const resultAction = await dispatch(deleteAddress(id));
      if (deleteAddress.fulfilled.match(resultAction)) {
        toast.success("Address Deleted");
      } else {
        toast.error(resultAction.payload || "Failed To Delete the Address");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-10">
      {!loading && (
        <h2 className="text-2xl font-bold mb-4 text-sky-900">Your Addresses</h2>
      )}
      {loading && (
        <div className="text-black text-4xl flex justify-center">
          <img src={loader} alt="loader Image" />
          {/* Loading Address Please Wait....... */}
        </div>
      )}
      {error && <div className="text-red-800">{error}</div>}
      {!loading && (
        <form className="space-y-2 mb-6" onSubmit={handleSubmit}>
          <label htmlFor="label" className="text-black">
            Label
          </label>
          <input
            type="text"
            name="label"
            placeholder="Label (Home,Work,etc)"
            value={form.label}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 border-black text-black"
          />
          <label htmlFor="address" className="text-black">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="address"
            value={form.address}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded-b-sm border-black text-black"
          />
          <label htmlFor="city" className="text-black">
            City
          </label>
          <input
            type="text"
            name="city"
            placeholder="city"
            value={form.city}
            onChange={handleChange}
            className="border w-full px-3 py-2 rounded-b-sm border-black text-black"
          />
          <label htmlFor="pinCode" className="text-black">
            Pin Code
          </label>
          <input
            name="postalCode"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 border-black text-black"
            required
          />
          <label htmlFor="country" className="text-black">
            Country
          </label>
          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 border-black text-black"
            required
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded font-medium transition"
          >
            {editId ? "Update Address" : "Add Address"}
          </button>
        </form>
      )}
      <div className="space-y-4">
        {addresses &&
          addresses.map((addr) => (
            <div
              key={addr._id}
              className="border border-sky-800 rounded-xl p-4 bg-white shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-black"
            >
              <div className="text-sm sm:text-base break-words max-w-full sm:max-w-[70%]">
                <span className="font-semibold">
                  {addr.label || "Address"}:
                </span>{" "}
                {addr.address}, {addr.city}, {addr.postalCode}, {addr.country}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(addr)}
                  className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(addr._id)}
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Address;
