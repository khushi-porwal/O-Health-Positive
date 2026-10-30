
const express = require("express");
const router = express.Router();

const {
  protectUser,
} = require("../../middleware/userauth/auth");

const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../../controllers/cart/cartController");

router.use(protectUser);

router.get("/", getCart);
router.post("/items", addToCart);
router.patch("/items/:vendorId/:itemId", updateCartItem);
router.delete("/items/:vendorId/:itemId", removeCartItem);

module.exports = router;
