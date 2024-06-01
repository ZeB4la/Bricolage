const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  }, // TODO: This is just for test, in production its open for "man-in-the-middle" attacks
});

const sendResetEmail = (email, token) => {
  const url = `http://yourfrontend.com/reset-password?token=${token}`;
  const mailOptions = {
    to: email,
    subject: "Password Reset",
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendResetEmail,
};
