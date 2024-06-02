const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
} = require("../../controllers/productController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const { roles } = require("../../models/userModel");
const upload = require("../../middleware/upload");

const router = express.Router();

// ==========================PUBLIC ROUTES==========================

// List All Products (Public)
router.get("/products", getAllProducts);

// ==========================ADMIN ROUTES==========================

// Create Product
router.post(
  "/admin/products",
  authMiddleware,
  roleMiddleware(roles.ADMIN),
  upload.single("image"),
  createProduct
);

// Update Product
router.put(
  "/admin/products/:productId",
  authMiddleware,
  roleMiddleware(roles.ADMIN),
  upload.single("image"),
  updateProduct
);

// Delete Product
router.delete(
  "/admin/products/:productId",
  authMiddleware,
  roleMiddleware(roles.ADMIN),
  deleteProduct
);

module.exports = router;
