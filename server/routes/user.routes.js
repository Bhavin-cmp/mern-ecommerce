import express from "express";
import {
  fetchAllUser,
  fetchUserById,
  login,
  register,
} from "../controllers/user.controller.js";
import { admin, protect } from "../middlewares/authMiddleware.js";
import { blockUser, unblockUser } from "../controllers/BlockUser.controller.js";
import upload from "../middlewares/uploadMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("profileImage"), register);

userRouter.post("/login", login);

userRouter.get("/fetchUser", protect, admin, fetchAllUser);

// Fetch User by ID
userRouter.get("/fetchUserById/:id", protect, fetchUserById);

//Block User
userRouter.put("/:id/block", protect, admin, blockUser);

// Unblock User
userRouter.put("/:id/unblock", protect, admin, unblockUser);

export default userRouter;
