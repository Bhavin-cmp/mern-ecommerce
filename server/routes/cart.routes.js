import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
} from "../controllers/Cart.Controller.js";

import { protect } from "../middlewares/authMiddleware.js";

const cartRouter = express.Router();
// console.log("cart router");
cartRouter.route("/").get(protect, getCart).post(protect, addToCart);
cartRouter.route("/remove").post(protect, removeFromCart);
cartRouter.route("/clear").post(protect, clearCart);

export default cartRouter;
