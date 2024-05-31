const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../api/config/jwtConfig");
const mongoose = require("mongoose");

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
};
