module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  jwtOptions: {
    expiresIn: "1h",
  },
  generatePayload: (user) => ({
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
  }),
};
