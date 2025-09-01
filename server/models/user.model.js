import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: "",
    },
    addresses: [
      {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        label: { type: String }, // e.g. "Home", "Work"
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      },
    ],
    blocked: {
      type: Boolean,
      default: false,
    },
    blockExpires: {
      type: Date,
      default: null, // null means no block
    },
  },
  { timestamps: true }
);

//Pre-save hook for Password Hashing
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.log("Error while hasing the password", error);
    next(error);
  }
});

// creating the password validation method
userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Password Comparison failed");
  }
};

export const User = mongoose.model("User", userSchema);
