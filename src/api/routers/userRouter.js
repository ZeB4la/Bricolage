const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  listUsersWithFilters,
  requestPasswordReset,
  resetPassword,
  changePassword,
  editUser,
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

// Request Password Reset
router.post("/request-password-reset", requestPasswordReset);

// Reset Password
router.post("/reset-password/:token", resetPassword);

// ==========================USER ROUTES==========================

// Get User Profile
router.get("/me", authMiddleware, getCurrentUser);

// Update User Profile (name only)
router.put("/me-update", authMiddleware, updateProfile);

// Change Password
router.post("/change-password", authMiddleware, changePassword);

// ==========================ADMIN ROUTES==========================

// List Users with Filters
router.get(
  "/admin/users",
  authMiddleware,
  roleMiddleware(roles.ADMIN),
  listUsersWithFilters
);

// Edit User
router.put(
  "/admin/users/:userId",
  authMiddleware,
  roleMiddleware(roles.ADMIN),
  editUser
);

module.exports = router;
