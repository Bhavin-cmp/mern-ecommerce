import express from "express";
import {
  addtoWishList,
  getWishList,
  removeFromWishList,
} from "../controllers/Wishlist.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const wishlistRouter = express.Router();

wishlistRouter.get("/:id", protect, getWishList);
wishlistRouter.post("/add/:id", protect, addtoWishList);
wishlistRouter.delete("/remove/:id", protect, removeFromWishList);

export default wishlistRouter;
