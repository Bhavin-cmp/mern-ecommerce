import { User } from "../models/user.model.js";
import Product from "../models/Product.model.js";

export const addtoWishList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const product = req.params.id;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product Id Required ",
      });
    }

    const productData = await Product.findById(product);
    if (!productData) {
      return res.status(400).json({
        success: false,
        message: "Product Not Found",
      });
    }
    const itemIndex = user.wishList.indexOf(product);
    if (itemIndex > -1) {
      user.wishList.splice(itemIndex, 1);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Product Removed from Wishlist",
        data: user.wishList,
      });
    } else {
      user.wishList.push(product);
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Product Added to Wishlist",
        data: user.wishList,
      });
    }
  } catch (error) {
    console.log("Error in Adding to wishlist", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.messaeg,
    });
  }
};

// Remove from wishlist
export const removeFromWishList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const productId = req.params.id;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product Id Required ",
      });
    }

    user.wishList = user.wishList.filter(
      (item) => item.toString() !== productId.toString()
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product Removed From Wishlist",
      data: user.wishList,
    });
  } catch (error) {
    console.log("Error while removing from wishlist", error);
    return res.status(500).json({
      success: false,
      message: "error While Removing item from wishlist ",
      error: error.message,
    });
  }
};

export const getWishList = async (req, res) => {
  try {
    console.log("Inside get WishList");
    const user = await User.findById(req.user._id).populate("wishList");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User Wishlist Fetched Successfully",
      data: user.wishList,
    });
  } catch (error) {
    console.log("Error while fetching wishlist", error);
    return res.status(500).json({
      success: false,
      message: "error While Fetching wishlist ",
      error: error.message,
    });
  }
};
