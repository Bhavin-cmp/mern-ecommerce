import express from "express";
import upload from "../middlewares/uploadMiddleware.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const uploadRouter = express.Router();

uploadRouter.post(
  "/",
  protect,
  admin,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: `Error uploading Image ${err.message}`,
        });
      }
      next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }
    res.status(201).json({
      success: true,
      message: "File Uploaded Sucessfully",
      imageUrl: req.file.path,
    });
  }
);

export default uploadRouter;
