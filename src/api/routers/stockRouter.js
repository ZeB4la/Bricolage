const express = require("express");
const {
  addStockEntry,
  getStockEntriesForProduct,
} = require("../../controllers/stockController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const { roles } = require("../../models/userModel");

const router = express.Router();

// ==========================ADMIN ROUTES==========================

// Add Stock Entry
router.post(
  "/admin/products/:productId/stock",
  authMiddleware,
  roleMiddleware(roles.ADMIN),
  addStockEntry
);

// Get Stock Entries for Product
router.get(
  "/admin/products/:productId/stock",
  authMiddleware,
  roleMiddleware(roles.ADMIN),
  getStockEntriesForProduct
);

module.exports = router;
