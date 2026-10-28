
const jwt = require("jsonwebtoken");
const User = require("../../models/login/User");

const protectUser = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    // Debug: never print the actual token
    console.log("Auth cookie received:", Boolean(token));
    console.log("JWT_SECRET configured:", Boolean(process.env.JWT_SECRET));

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in to continue",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");
      return res.status(500).json({
        success: false,
        message: "Authentication configuration error",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error("Authentication error:", error.name, error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired session",
    });
  }
};

module.exports = { protectUser };
