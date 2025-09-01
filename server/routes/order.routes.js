import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  updateOrderToDelivered,
  updateOrderToPaid,
} from "../controllers/Order.Controller.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const orderRoutes = express.Router();

orderRoutes
  .route("/")
  .post(protect, createOrder)
  .get(protect, admin, getOrders);
orderRoutes.route("/myorders").get(protect, getMyOrders);
orderRoutes.route("/:id/status").put(protect, admin, updateOrderStatus);
orderRoutes.route("/:id").get(protect, getOrderById);
orderRoutes.route("/:id/pay").put(protect, updateOrderToPaid);
orderRoutes.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default orderRoutes;
