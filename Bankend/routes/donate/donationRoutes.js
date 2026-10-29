
const express = require("express");
const router = express.Router();

const {
  createDonation,
} = require("../../controllers/donate/donationController");

const {
  createOrder,
  verifyPayment,
} = require("../../controllers/donate/paymentController");

// Existing endpoint — pending donation record only
router.post("/create-donate", createDonation);

// New payment endpoints
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

module.exports = router;
