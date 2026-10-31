
const express = require("express");
const router = express.Router();

const { protectUser } = require("../../middleware/userauth/auth");

const {
  createCheckout,
  verifyOrderPayment,
  getMyOrderById,
  getMyOrders
} = require("../../controllers/order/orderController");

router.use(protectUser);

router.post("/checkout", createCheckout);
router.get("/:merchantOrderId/status", verifyOrderPayment);

// Customer ke apne orders
router.get("/my-orders", getMyOrders);
router.get("/my-orders/:id", getMyOrderById);
module.exports = router;
