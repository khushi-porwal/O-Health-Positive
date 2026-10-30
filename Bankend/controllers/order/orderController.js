
const crypto = require("crypto");

const Order = require("../../models/order/Order");
const Cart = require("../../models/cart/Cart");
const Vendor = require("../../models/vendor/Vendor");

const {
  initiatePhonePePayment,
  getPhonePeOrderStatus,
} = require("../../services/phoneService");

function getUserId(req) {
  return req.user?._id || req.user?.id;
}

function createMerchantOrderId() {
  return `OPH${Date.now()}${crypto.randomBytes(6).toString("hex")}`;
}

function getString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function getPaymentDetails(order) {
  const details = order.paymentDetails;

  if (details && typeof details.toObject === "function") {
    return details.toObject();
  }

  return details && typeof details === "object" ? details : {};
}

function getProductName(product) {
  return product.name || product.title || "Product";
}

async function createCheckout(req, res) {
  let order = null;

  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Please log in first.",
      });
    }

    const fullName = getString(req.body.fullName);
    const phone = getString(req.body.phone);
    const email = getString(req.body.email).toLowerCase();
    const address = getString(req.body.address);
    const city = getString(req.body.city);
    const state = getString(req.body.state);
    const pincode = getString(req.body.pincode);

    if (
      !fullName ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "Please complete all required delivery details.",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        message: "Enter a valid 10-digit Indian mobile number.",
      });
    }

    if (!/^\d{6}$/.test(pincode)) {
      return res.status(400).json({
        message: "Enter a valid 6-digit pincode.",
      });
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return res.status(400).json({
        message: "Enter a valid email address.",
      });
    }

    // Assumes Cart has a userId field and an items array.
    const cart = await Cart.findOne({ userId });

    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty.",
      });
    }

    const orderItems = [];
    let totalPaise = 0;

    for (const cartItem of cart.items) {
      const vendor = await Vendor.findById(cartItem.vendorId);

      if (!vendor || vendor.status !== "approved") {
        return res.status(400).json({
          message: "A vendor in your cart is no longer available.",
        });
      }

      // Assumes vendor products are embedded in vendor.items.
      const product = vendor.items?.id(cartItem.itemId);

      if (!product) {
        return res.status(400).json({
          message: "A product in your cart is no longer available.",
        });
      }

      if (product.active === false || product.isActive === false) {
        return res.status(400).json({
          message: `${getProductName(product)} is unavailable.`,
        });
      }

      const quantity = Number(cartItem.quantity);
      const price = Number(product.price);
      const stock = Number(product.stock);

      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isFinite(stock) ||
        stock < quantity
      ) {
        return res.status(400).json({
          message: `Invalid price, quantity or insufficient stock for ${getProductName(product)}.`,
        });
      }

      // Calculate money in paise to avoid floating-point total errors.
      const pricePaise = Math.round(price * 100);
      const subtotalPaise = pricePaise * quantity;

      if (
        !Number.isSafeInteger(pricePaise) ||
        !Number.isSafeInteger(subtotalPaise)
      ) {
        return res.status(400).json({
          message: "A product price is outside the supported range.",
        });
      }

      totalPaise += subtotalPaise;

      orderItems.push({
        vendorId: vendor._id,
        itemId: product._id,
        vendorName: vendor.name,
        productName: getProductName(product),
        image: product.image || "",
        price: pricePaise / 100,
        quantity,
        subtotal: subtotalPaise / 100,
      });
    }

    if (
      !Number.isSafeInteger(totalPaise) ||
      totalPaise <= 0
    ) {
      return res.status(400).json({
        message: "The order total is invalid.",
      });
    }

    const totalAmount = totalPaise / 100;
    const merchantOrderId = createMerchantOrderId();

    order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      currency: "INR",
      status: "pending",
      paymentProvider: "phonepe",
      merchantOrderId,
      deliveryDetails: {
        fullName,
        phone,
        email,
        address,
        city,
        state,
        pincode,
      },
      paymentDetails: {
        initiatedAt: new Date(),
      },
    });

    const frontendUrl = process.env.FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL is not configured");
    }

    const redirectUrl = new URL("/payment-result", frontendUrl);
    redirectUrl.searchParams.set("merchantOrderId", merchantOrderId);

    const payment = await initiatePhonePePayment({
      merchantOrderId,
      amountInPaise: totalPaise,
      redirectUrl: redirectUrl.toString(),
    });

    if (!payment?.redirectUrl) {
      throw new Error("PhonePe did not return a redirect URL");
    }

    order.paymentDetails = {
      ...getPaymentDetails(order),
      providerOrderId: payment.orderId || "",
      paymentInitiatedAt: new Date(),
    };

    await order.save();

    return res.status(201).json({
      message: "Order created. Continue to PhonePe to pay.",
      orderId: order._id,
      merchantOrderId,
      totalAmount,
      currency: "INR",
      redirectUrl: payment.redirectUrl,
    });
  } catch (error) {
    console.error("Create checkout error:", error.message);

    // Keep the pending order for reconciliation if the payment
    // request timed out or its result is uncertain.
    if (order && order.status === "pending") {
      order.paymentDetails = {
        ...getPaymentDetails(order),
        initiationError: true,
        lastInitiationErrorAt: new Date(),
      };

      await order.save().catch((saveError) => {
        console.error(
          "Could not update order payment metadata:",
          saveError.message
        );
      });
    }

    return res.status(500).json({
      message:
        "Unable to start checkout. Check your order status or contact support before retrying.",
    });
  }
}


async function verifyOrderPayment(req, res) {
  try {
    const userId = getUserId(req);
    const merchantOrderId = getString(req.params.merchantOrderId);

    if (!userId) {
      return res.status(401).json({
        message: "Please log in first.",
      });
    }

    if (!merchantOrderId) {
      return res.status(400).json({
        message: "Merchant order ID is required.",
      });
    }

    const order = await Order.findOne({
      merchantOrderId,
      userId,
      paymentProvider: "phonepe",
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    // Remove only the products included in this order.
    // Safe to retry if a previous cart-clearing attempt failed.
    const clearPurchasedItems = async () => {
      if (!order.items?.length) return;

      await Cart.updateOne(
        { userId: order.userId },
        {
          $pull: {
            items: {
              $or: order.items.map((item) => ({
                vendorId: item.vendorId,
                itemId: item.itemId,
              })),
            },
          },
        }
      );
    };

    // Already paid: retry cart clearing if necessary.
    if (order.status === "paid") {
      await clearPurchasedItems();

      return res.status(200).json({
        success: true,
        orderId: order._id,
        merchantOrderId: order.merchantOrderId,
        status: "paid",
        totalAmount: order.totalAmount,
        currency: order.currency,
      });
    }

    if (order.status === "cancelled") {
      return res.status(409).json({
        message: "This order has been cancelled.",
        status: order.status,
      });
    }

    const paymentStatus =
      await getPhonePeOrderStatus(merchantOrderId);

    const state = String(
      paymentStatus?.state || ""
    ).toUpperCase();

    const expectedAmountPaise = Math.round(
      order.totalAmount * 100
    );

    const actualAmountPaise = Number(paymentStatus?.amount);

    // SUCCESSFUL PAYMENT
    if (state === "COMPLETED") {
      if (
        !Number.isSafeInteger(actualAmountPaise) ||
        actualAmountPaise !== expectedAmountPaise
      ) {
        console.error(
          "PhonePe amount mismatch:",
          merchantOrderId
        );

        return res.status(409).json({
          message: "Payment amount could not be verified.",
          status: order.status,
        });
      }

      const completedPayment = Array.isArray(
        paymentStatus.paymentDetails
      )
        ? paymentStatus.paymentDetails.find(
            (entry) =>
              entry &&
              String(entry.state || "").toUpperCase() === "COMPLETED" &&
              entry.transactionId
          )
        : null;

      // Atomic update: only one request can change pending to paid.
      const updatedOrder = await Order.findOneAndUpdate(
        {
          _id: order._id,
          status: "pending",
        },
        {
          $set: {
            status: "paid",
            paidAt: new Date(),
            paymentReference:
              completedPayment?.transactionId || "",
            "paymentDetails.verifiedState": state,
            "paymentDetails.verifiedAt": new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      // Handle simultaneous verification requests.
      if (!updatedOrder) {
        const currentOrder = await Order.findById(order._id);

        if (currentOrder?.status !== "paid") {
          return res.status(409).json({
            message: "Order status changed. Please check again.",
            status: currentOrder?.status,
          });
        }

        await clearPurchasedItems();

        return res.status(200).json({
          success: true,
          orderId: currentOrder._id,
          merchantOrderId: currentOrder.merchantOrderId,
          status: "paid",
          totalAmount: currentOrder.totalAmount,
          currency: currentOrder.currency,
        });
      }

      // Clear cart only after payment is verified and order is paid.
      await clearPurchasedItems();

      return res.status(200).json({
        success: true,
        message: "Payment verified and order confirmed.",
        orderId: updatedOrder._id,
        merchantOrderId: updatedOrder.merchantOrderId,
        status: updatedOrder.status,
        totalAmount: updatedOrder.totalAmount,
        currency: updatedOrder.currency,
        paidAt: updatedOrder.paidAt,
      });
    }

    // FAILED PAYMENT
    if (state === "FAILED") {
      const updatedOrder = await Order.findOneAndUpdate(
        {
          _id: order._id,
          status: "pending",
        },
        {
          $set: {
            status: "failed",
            "paymentDetails.verifiedState": state,
            "paymentDetails.verifiedAt": new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      const currentOrder =
        updatedOrder || await Order.findById(order._id);

      // Never report failure if another request confirmed payment.
      if (currentOrder?.status === "paid") {
        await clearPurchasedItems();

        return res.status(200).json({
          success: true,
          status: "paid",
          orderId: currentOrder._id,
          merchantOrderId: currentOrder.merchantOrderId,
          totalAmount: currentOrder.totalAmount,
          currency: currentOrder.currency,
        });
      }

      return res.status(200).json({
        success: false,
        message: "PhonePe reports that the payment failed.",
        orderId: currentOrder?._id,
        status: currentOrder?.status,
      });
    }

    // PENDING / UNKNOWN
    return res.status(202).json({
      success: false,
      message: "Payment is still being processed. Please check again.",
      orderId: order._id,
      merchantOrderId,
      status: "pending",
      paymentState: state || "UNKNOWN",
    });

  } catch (error) {
    console.error(
      "Verify order payment error:",
      error.message
    );

    return res.status(502).json({
      message: "Unable to verify payment right now. Please retry shortly.",
    });
  }
}


module.exports = {
  createCheckout,
  verifyOrderPayment,
};
