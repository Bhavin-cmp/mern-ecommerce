import express from "express";

import { protect } from "../middlewares/authMiddleware.js";
import { addProductReview } from "../controllers/Review.controller.js";

const productReview = express.Router();

productReview.route("/:id/reviews").post(protect, addProductReview);

export default productReview;
