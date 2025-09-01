import express from "express";
import { createRazorpayOrder } from "../controllers/RazorPay.Controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const razorPayRouter = express.Router();

razorPayRouter.post("/create-order", protect, createRazorpayOrder);

export default razorPayRouter;
