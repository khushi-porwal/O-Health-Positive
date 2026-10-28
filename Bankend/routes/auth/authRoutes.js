
const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  signup,
  login,
  getMe,
  logout,
} = require("../../controllers/auth/authController");

const { protectUser } = require("../../middleware/userauth/auth");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.get("/me", protectUser, getMe);
router.post("/logout", logout);

module.exports = router;
