const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../../controllers/categoryController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const { roles } = require("../../models/userModel");

const router = express.Router();

// ==========================PUBLIC ROUTES==========================

// List All Categories
router.get("/categories", getAllCategories);

// ==========================ADMIN ROUTES==========================

// Create Category
router.post(
  "/admin/categories",
  authMiddleware,
  roleMiddleware(roles.ADMIN),
  createCategory
);

// Update Category
router.put(
  "/admin/categories/:categoryId",
  authMiddleware,
  roleMiddleware(roles.ADMIN),
  updateCategory
);

// Delete Category
router.delete(
  "/admin/categories/:categoryId",
  authMiddleware,
  roleMiddleware(roles.ADMIN),
  deleteCategory
);

module.exports = router;
