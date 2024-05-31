const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  listUsersWithFilters,
} = require("../../controllers/userController");
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const { roles } = require("../../models/userModel");

const router = express.Router();

// ==========================PUBLIC ROUTES==========================

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// ==========================USER ROUTES==========================

// Get User Profile
router.get("/me", authMiddleware, getCurrentUser);

// Update User Profile (name only)
router.put("/me-update", authMiddleware, updateProfile);

// ==========================ADMIN ROUTES==========================

// List Users with Filters
router.get(
  "/admin/users",
  authMiddleware,
  roleMiddleware(roles.ADMIN),
  listUsersWithFilters
);

module.exports = router;
