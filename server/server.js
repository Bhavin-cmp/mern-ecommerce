import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import cors from "cors";

import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import orderRoutes from "./routes/order.routes.js";
import uploadRouter from "./routes/uploadRoutes.js";
import cartRouter from "./routes/Cart.routes.js";
import addressRoute from "./routes/address.routes.js";
import productReview from "./routes/review.routes.js";
import razorPayRouter from "./routes/razorPay.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import userActivityRouter from "./routes/activityLog.routes.js";

dotenv.config();
const app = express();

//Database Connection
connectDb();

//Middleware
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRouter);
app.use("/api/cart", cartRouter);
app.use("/api/addresses", addressRoute);
app.use("/api/productReview", productReview);
app.use("/api/razorpay", razorPayRouter);
app.use("/api/wishList", wishlistRouter);
app.use("/api/logs", userActivityRouter);

app.get("/", (req, res) => {
  return res.send("Api is Running");
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
