
const mongoose = require("mongoose");
const Cart = require("../../models/cart/Cart");
const Vendor = require("../../models/vendor/Vendor");

const isValidId = (id) => mongoose.isValidObjectId(id);

const getCartResponse = async (cart) => {
  const items = await Promise.all(
    cart.items.map(async (cartItem) => {
      const vendor = await Vendor.findOne({
        _id: cartItem.vendorId,
        status: "approved",
      }).select("name items");

      const product = vendor?.items.id(cartItem.itemId);

      if (!product || !product.isActive) {
        return {
          vendorId: cartItem.vendorId,
          itemId: cartItem.itemId,
          unavailable: true,
          quantity: cartItem.quantity,
        };
      }

      return {
        vendorId: vendor._id,
        vendorName: vendor.name,
        itemId: product._id,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        stock: product.stock,
        quantity: cartItem.quantity,
        subtotal: product.price * cartItem.quantity,
        unavailable: false,
      };
    })
  );

  const availableItems = items.filter((item) => !item.unavailable);

  return {
    items,
    totalItems: availableItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),
    totalAmount: availableItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    ),
  };
};

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        userId: req.user._id,
        items: [],
      });
    }

    const result = await getCartResponse(cart);

    return res.status(200).json({
      success: true,
      cart: result,
    });
  } catch (error) {
    console.error("Get cart error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch cart",
    });
  }
};

// POST /api/cart/items
// POST /api/cart/items
// POST /api/cart/items
exports.addToCart = async (req, res) => {
  try {
    console.log("\n========== ADD TO CART START ==========");
    console.log("Request body:", req.body);
    console.log("Authenticated user:", req.user?._id);

    const { vendorId, itemId } = req.body;
    const quantity = req.body.quantity ?? 1;

    // 1. Validate IDs
    if (!isValidId(vendorId) || !isValidId(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor or product ID",
      });
    }

    // 2. Validate quantity
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    // 3. Find approved vendor
    const vendor = await Vendor.findOne({
      _id: vendorId,
      status: "approved",
    });

    console.log("Vendor found:", vendor?.name || null);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found or not approved",
      });
    }

    // 4. Find product inside vendor.items
    const product = vendor.items.id(itemId);

    console.log("Product found:", product?.name || null);
    console.log("Product stock:", product?.stock);
    console.log("Product active:", product?.isActive);

    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Product is unavailable",
      });
    }

    // 5. Check stock
    if (!Number.isFinite(product.stock) || product.stock < 1) {
      return res.status(409).json({
        success: false,
        message: "Product is out of stock",
      });
    }

    // 6. Find or create user's cart
    let cart = await Cart.findOne({
      userId: req.user._id,
    });

    if (!cart) {
      cart = new Cart({
        userId: req.user._id,
        items: [],
      });
    }

    // 7. Check if product already exists in cart
    const existingItem = cart.items.find(
      (cartItem) =>
        cartItem.vendorId.toString() === vendorId &&
        cartItem.itemId.toString() === itemId
    );

    const currentQuantity = existingItem
      ? existingItem.quantity
      : 0;

    const newQuantity = currentQuantity + quantity;

    // 8. Prevent quantity exceeding stock
    if (newQuantity > product.stock) {
      return res.status(409).json({
        success: false,
        message: `Only ${product.stock} item(s) are available`,
      });
    }

    // 9. Update existing item or add new item
    if (existingItem) {
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        vendorId: vendor._id,
        itemId: product._id,
        quantity,
      });
    }

    console.log("Cart items before save:", cart.items);

    // 10. Save cart to MongoDB
    await cart.save();

    console.log("Cart saved successfully:", cart._id);

    // 11. Return updated cart
    const updatedCart = await getCartResponse(cart);

    console.log("Cart response:", updatedCart);
    console.log("========== ADD TO CART SUCCESS ==========\n");

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("========== ADD TO CART ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to add product to cart",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
};

// PATCH /api/cart/items/:vendorId/:itemId
exports.updateCartItem = async (req, res) => {
  try {
    const { vendorId, itemId } = req.params;
    const { quantity } = req.body;

    if (!isValidId(vendorId) || !isValidId(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor or product ID",
      });
    }

    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.find(
      (item) =>
        item.vendorId.toString() === vendorId &&
        item.itemId.toString() === itemId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    const vendor = await Vendor.findOne({
      _id: vendorId,
      status: "approved",
    });

    const product = vendor?.items.id(itemId);

    if (!product || !product.isActive) {
      return res.status(409).json({
        success: false,
        message: "Product is unavailable",
      });
    }

    if (quantity > product.stock) {
      return res.status(409).json({
        success: false,
        message: `Only ${product.stock} item(s) are available`,
      });
    }

    cartItem.quantity = quantity;
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart: await getCartResponse(cart),
    });
  } catch (error) {
    console.error("Update cart error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update cart",
    });
  }
};

// DELETE /api/cart/items/:vendorId/:itemId
exports.removeCartItem = async (req, res) => {
  try {
    const { vendorId, itemId } = req.params;

    if (!isValidId(vendorId) || !isValidId(itemId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vendor or product ID",
      });
    }

    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.vendorId.toString() === vendorId &&
          item.itemId.toString() === itemId
        )
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: await getCartResponse(cart),
    });
  } catch (error) {
    console.error("Remove cart item error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to remove product",
    });
  }
};
