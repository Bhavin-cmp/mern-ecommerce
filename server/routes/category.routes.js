import express from "express";
import {
  createCategoty,
  deleteCategory,
  getCategories,
} from "../controllers/Category.Controller.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const categoryRouter = express.Router();

categoryRouter
  .route("/")
  .get(getCategories)
  .post(protect, admin, createCategoty);

categoryRouter.route("/:id").delete(protect, admin, deleteCategory);

export default categoryRouter;
