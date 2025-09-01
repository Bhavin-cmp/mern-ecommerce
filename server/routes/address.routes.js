import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addAddress,
  deleteAddress,
  updateAddress,
} from "../controllers/Address.controller.js";
import { User } from "../models/user.model.js";

const addressRoute = express.Router();

addressRoute.post("/addresses", protect, addAddress);
addressRoute.put("/addresses/:addressId", protect, updateAddress);
addressRoute.delete("/addresses/:addressId", protect, deleteAddress);
addressRoute.get("/addresses", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ addresses: user.addresses });
  } catch (error) {
    console.log("Error fetching address", error.message);
    return res.status(500).json({
      success: false,
      message: "Error while fetching the address",
      error: error.message,
    });
  }
});

export default addressRoute;
