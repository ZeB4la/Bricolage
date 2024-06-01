const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../api/config/jwtConfig");
const mongoose = require("mongoose");
const { sendResetEmail } = require("../services/emailService");

// Change Password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword, cnfNewPassword } = req.body;

  if (!oldPassword || !newPassword || !cnfNewPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword !== cnfNewPassword) {
    return res.status(400).json({ message: "New passwords do not match" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const token = jwt.sign({ userId: user._id }, jwtConfig.jwtSecret, {
      expiresIn: "5m",
    });

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 300000;
    await user.save();

    await sendResetEmail(email, token);

    res.json({ message: "Password reset email sent", token: token }); // TODO: Remove token
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { newPassword, cnfPassword } = req.body;
  const { token } = req.params;

  if (newPassword !== cnfPassword)
    return res.status(400).json({ message: "Passwords do not match" });

  if (!token) return res.status(400).json({ message: "Token is required" });
  if (!newPassword)
    return res.status(400).json({ message: "New password is required" });

  try {
    const decoded = jwt.verify(token, jwtConfig.jwtSecret);

    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    const newUser = await user.save();
    const payload = jwtConfig.generatePayload(user);
    const token = jwt.sign(payload, jwtConfig.jwtSecret, jwtConfig.jwtOptions);

    res.status(201).json({
      message: "User registered successfully",
      token: token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const payload = jwtConfig.generatePayload(user);
    const token = jwt.sign(payload, jwtConfig.jwtSecret, jwtConfig.jwtOptions);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Profile
const getCurrentUser = (req, res) => {
  res.json(req.user);
};

// Update User Profile (name only)
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = req.body.name || user.name;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// List Users with Filters
const listUsersWithFilters = async (req, res) => {
  const { page = 1, limit = 10, sort = "name", role, search } = req.query;

  try {
    let query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      if (mongoose.Types.ObjectId.isValid(search)) {
        query._id = search;
      } else {
        query.$or = [{ name: regex }, { email: regex }];
      }
    }

    const users = await User.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  listUsersWithFilters,
  requestPasswordReset,
  resetPassword,
  changePassword,
};
