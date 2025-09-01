import express from "express";
import {
  createProduct,
  createProductReview,
  deleteProduct,
  fetchProductByCategory,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/Product/Product.controller.js";
import { admin, protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import Product from "../models/Product.model.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(getProducts)
  .post(protect, admin, upload.single("image"), createProduct);

productRouter
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

productRouter.route("/:id/reviews").post(protect, createProductReview);

// Fethc Product by category
productRouter.get("/category/:category", fetchProductByCategory);

productRouter.post("/bulk", protect, admin, async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }
    const productWithUser = products.map((prod) => ({
      ...prod,
      user: req.user._id,
    }));
    // Optionally validate each product here
    const created = await Product.insertMany(productWithUser);
    res.status(201).json(created);
  } catch (err) {
    console.log("Error while bulk product", err);
    res.status(500).json({ success: "false", message: err.message });
  }
});

export default productRouter;
