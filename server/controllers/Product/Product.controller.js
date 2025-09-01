import Products from "../../models/Product.model.js";
import asyncHandler from "express-async-handler";

// @desc   Get All Product
// @route GET/api/products
// @access public

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Products.find({});
  res.json(products);
});

// @desc get product by ID
// @routes GET/API/Products/:id
// @ access public

export const getProductById = async (req, res) => {
  try {
    // console.log("requesttttttttttttt", req);
    const productId = req.params.id;
    // console.log("Product Iddddddddddd", productId);

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const product = await Products.findById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product by ID",
      error: error.message,
    });
  }
};

export const fetchProductByCategory = async (req, res) => {
  const category = req.params.category;

  if (!category) {
    return res
      .status(400)
      .json({ success: false, message: "Category Is Required" });
  }
  try {
    // console.log("Check Category", category);
    const products = await Products.find({ category });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
      });
    }
    return res.status(200).json({
      success: true,
      message: `${category} products fetched successfully`,
      products,
    });
  } catch (error) {
    console.log("Error While fetching the products by Id", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch the products by Category",
      error: error.message,
    });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  console.log("request product body data", req);
  const { name, price, description, brand, category, countInStock } = req.body;

  // Validate required fields
  if (
    !name ||
    !price ||
    !description ||
    !brand ||
    !category ||
    countInStock === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required product fields",
    });
  }

  // Validate image upload
  const image = req.file?.path;
  if (!image) {
    return res.status(400).json({
      success: false,
      message: "Image upload failed, image required",
    });
  }

  // Create the product
  const product = new Products({
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    user: req.user._id,
  });

  const createdProduct = await product.save();

  res.status(201).json({
    success: true,
    message: "Product Created Successfully",
    product: createdProduct,
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock } = req.body;

  // Find the product by ID
  const product = await Products.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Update fields only if provided
  product.name = name || product.name;
  product.price = price || product.price;
  product.description = description || product.description;
  product.brand = brand || product.brand;
  product.category = category || product.category;
  product.countInStock = countInStock || product.countInStock;

  // Update image if a new one is uploaded
  if (req.file?.path) {
    product.image = req.file.path;
  }

  const updatedProduct = await product.save();

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
    product: updatedProduct,
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Products.findById(req.params.id);

  if (product) {
    await Products.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  try {
    // Validate rating and comment
    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }
    // console.log("req.user:", req.user.userName);
    // Validate user name
    if (!req.user.userName) {
      return res.status(400).json({
        success: false,
        message: "User name is required to add a review",
      });
    }

    const product = await Products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "This product has already been reviewed by you.",
      });
    }

    // Create a new review
    const review = {
      name: req.user.userName, // Ensure this is populated
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // Add the review to the product
    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // Update the product's average rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error(`Error while adding review: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the review",
      error: error.message,
    });
  }
});
