const express = require("express");
const router = express.Router();
const {loginAdmin} = require("../../controllers/admin/adminController")
const {protectAdmin} = require("../../middleware/auth/authMiddleware")

router.post("/login", loginAdmin)

router.get("/profile", protectAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin authenticated successfully",
    admin: req.admin,
  });
});
module.exports = router;
