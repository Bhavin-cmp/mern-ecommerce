import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import asyncHandler from "express-async-handler";

//Get the user cart
export const getCart = asyncHandler(async (req, res) => {
  // console.log("GetCart");
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name price countInStock image"
  );
  console.log("get Carttt", cart);
  if (!cart) {
    return res
      .status(200)
      .json({ success: true, cart: { items: [] }, message: "Cart is empty" });
  }
  res.status(200).json({ success: true, cart });
});

// Add item to the Cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  // console.log("Product found:", product);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product is not found" });
  }

  if (product.countInStock < quantity) {
    return res.status(400).json({
      success: false,
      message: "Insufficient stock for this product",
    });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity = quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  await cart.populate("items.product", "name price countInStock");
  res.status(200).json({
    success: true,
    cart,
    message: "Item added to the cart sucessfully",
  });
});

//Remove item from the cart

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res
      .status(404)
      .json({ success: false, message: "Cart not found for this user" });
  }
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  await cart.populate("items.product", "name price countInStock"); // <-- Add this line

  res.status(200).json({
    success: true,
    cart,
    message: "Item removed from the cart successfully",
  });
});

//Clear the Cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return res
      .status(404)
      .json({ success: false, message: "Cart not found for this user" });
  }
  cart.items = [];
  await cart.save();
  await cart.populate("items.product", "name price countInStock"); // <-- Add this line

  res.status(200).json({
    success: true,
    cart,
    message: "Cart cleared successfully",
  });
});
