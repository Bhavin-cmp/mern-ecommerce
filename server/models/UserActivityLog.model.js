import mongoose from "mongoose";

const userActivityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: String,
      required: true,
      enum: [
        "login",
        "logout",
        "product_click",
        "add_to_cart",
        "remove_from_cart",
        "add_to_wishList",
        "remove_from_wishList",
        "checkout_start",
        "order_placed",
        "payment_failed",
        "profile_update",
        "password_change",
        "address_add",
      ],
    },
    details: {
      type: Object,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

export default mongoose.model("UserActivityLog", userActivityLogSchema);
