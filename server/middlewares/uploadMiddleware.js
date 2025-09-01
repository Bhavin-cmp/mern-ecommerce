import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Ensure Cloudinary is configured properly
if (
  !cloudinary.config().cloud_name ||
  !cloudinary.config().api_key ||
  !cloudinary.config().api_secret
) {
  throw new Error(
    "Cloudinary is not configured properly. Check environment variables."
  );
}

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const userName = req.body.userName || "user";
    const timestamp = Date.now();
    return {
      folder: process.env.CLOUDINARY_FOLDER || "Users", // Use environment variable for folder name
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
      public_id: `${userName}_${timestamp}`, // Unique public ID for the image
    };
  },
});

// Configure Multer with custom error handling
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

export default upload;
