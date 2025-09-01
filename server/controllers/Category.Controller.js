import asyncHandler from "express-async-handler";
import Category from "../models/category.model.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  if (!categories || categories.length === 0) {
    return res.status(400).json({
      success: false,
      message: "No Category Found",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Categories fetched sucessfully",
    categories,
  });
});

export const createCategoty = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "Category Name is required",
    });
  }

  const existing = await Category.findOne({ name });
  console.log("Category Name CHecking", existing);

  if (existing) {
    return res
      .status(400)
      .json({ success: false, message: "Category Already Exist" });
  }

  const category = new Category({ name });

  const createdCategory = await category.save();

  res.status(201).json({
    success: true,
    message: "Category Created Successfully",
    categoryName: createdCategory,
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.deleteOne({ _id: req.params.id });
  res.json({ message: "Category removed" });
});
