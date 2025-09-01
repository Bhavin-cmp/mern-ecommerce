import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { bulkCreateProducts } from "../../redux/slices/productSlice";

const BulkProductUpload = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => {
    console.log("Bulk Product state", state);
    return state.product;
  });
  const [products, setProducts] = useState([]);
  const [fileType, setFileType] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    setFileType(ext);

    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        complete: (results) => setProducts(results.data),
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setProducts(json);
      };
      reader.readAsArrayBuffer(file);
    } else if (ext === "json") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setProducts(JSON.parse(evt.target.result));
      };
      reader.readAsText(file);
    } else {
      alert("Unsupported file type!");
    }
  };

  const REQUIRED_FIELDS = [
    "name",
    "price",
    "description",
    "brand",
    "category",
    "countInStock",
    "image",
  ];

  const validateProducts = (products) => {
    const errors = [];
    products.forEach((prod, idx) => {
      // Skip completely empty objects (all fields missing or empty)
      const isEmpty = REQUIRED_FIELDS.every(
        (field) =>
          prod[field] === undefined ||
          prod[field] === null ||
          prod[field].toString().trim() === ""
      );
      if (isEmpty) return; // skip this row

      REQUIRED_FIELDS.forEach((field) => {
        if (["price", "countInStock"].includes(field)) {
          if (
            prod[field] === undefined ||
            prod[field] === null ||
            prod[field] === ""
          ) {
            errors.push(`Row ${idx + 2}: Missing "${field}"`);
          }
        } else {
          if (
            prod[field] === undefined ||
            prod[field] === null ||
            prod[field].toString().trim() === ""
          ) {
            errors.push(`Row ${idx + 2}: Missing "${field}"`);
          }
        }
      });
    });
    return errors;
  };

  const handleUpload = async () => {
    if (products.length === 0) {
      setValidationErrors(["No products to upload!"]);
      return;
    }
    const errors = validateProducts(products);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]); // Clear previous errors
    const result = await dispatch(bulkCreateProducts(products));
    if (result.meta.requestStatus === "fulfilled") {
      setProducts([]);
      alert("Bulk upload complete!");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 bg-white p-8 rounded-2xl shadow-lg border border-gray-100 transition-all duration-300">
      <h2 className="text-3xl font-bold mb-2 text-sky-800 text-center">
        Bulk Product Upload
      </h2>
      <p className="text-sm text-gray-500 mb-6 text-center">
        Upload a CSV, Excel, or JSON file containing product data.
      </p>

      <div className="mb-6">
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-full border-2 border-dashed border-sky-300 rounded-xl px-4 py-10 cursor-pointer hover:bg-sky-50 transition duration-200"
        >
          <span className="text-center text-sky-600 font-medium">
            📁 Click or Drag & Drop your file here
          </span>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      </div>

      {products.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-green-600 font-medium">
            ✅ {products.length} products parsed and ready to upload.
          </span>
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-300 text-red-700 rounded p-4 mt-4 mb-2">
          <ul className="list-disc pl-5">
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleUpload}
        className={`w-full text-white px-6 py-3 rounded-xl font-semibold transition duration-200 ${
          loading || products.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        disabled={loading || products.length === 0}
      >
        {loading ? "Uploading..." : "Upload Products"}
      </button>

      {error && (
        <div className="text-red-500 mt-4 text-sm font-medium">{error}</div>
      )}
    </div>
  );
};

export default BulkProductUpload;
