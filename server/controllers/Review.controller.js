import Product from "../models/Product.model.js";
import asyncHandler from "express-async-handler";

export const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        return res.status(400).json({
          success: false,
          messagee: "Product Already reviewed",
        });
      }

      const review = {
        user: req.user._id,
        name: req.user.fullName || req.user.userName,
        rating: Number(rating),
        comment,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();

      res.status(201).json({
        success: true,
        message: "Review Added",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Product Not found",
      });
    }
  } catch (error) {
    console.log("Error in Produuct Review");
    return res.status(500).json({
      success: false,
      message: "Error while Add Product Review",
      error: error.message,
    });
  }
});
