
const express = require("express");
const router = express.Router();

const { protectUser } = require("../../middleware/userauth/auth");

const {
  createCheckout,
  verifyOrderPayment,
} = require("../../controllers/order/orderController");

router.use(protectUser);

router.post("/checkout", createCheckout);
router.get("/:merchantOrderId/status", verifyOrderPayment);

module.exports = router;
