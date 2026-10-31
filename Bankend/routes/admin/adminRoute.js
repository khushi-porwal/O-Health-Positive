const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
} = require("../../controllers/admin/adminOrderController");
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

// Order management
router.get("/orders", protectAdmin, getAllOrders);

router.get("/orders/:id", protectAdmin, getOrderDetails);

router.patch(
  "/orders/:id/status",
  protectAdmin,
  updateOrderStatus
);

module.exports = router;
