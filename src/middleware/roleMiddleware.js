const { roleHierarchy } = require("../models/userModel");

const roleMiddleware = (requiredRole) => {
  return (req, res, next) => {
    if (
      req.user &&
      roleHierarchy[req.user.role] >= roleHierarchy[requiredRole]
    ) {
      next();
    } else {
      res
        .status(403)
        .json({ message: "Access forbidden: insufficient permissions" });
    }
  };
};

module.exports = roleMiddleware;
