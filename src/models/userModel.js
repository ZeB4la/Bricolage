const mongoose = require("mongoose");

const roles = {
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

const roleHierarchy = {
  user: 1,
  moderator: 2,
  admin: 3,
};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(roles), default: roles.USER },
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  roles,
  roleHierarchy,
};
