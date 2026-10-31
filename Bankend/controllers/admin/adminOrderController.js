
const mongoose = require("mongoose");
const Order = require("../../models/order/Order");

// GET ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.paymentStatus) {
      const allowedPaymentStatuses = [
        "pending",
        "paid",
        "failed",
        "cancelled",
      ];

      if (!allowedPaymentStatuses.includes(req.query.paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment status.",
        });
      }

      filter.status = req.query.paymentStatus;
    }

    if (req.query.orderStatus) {
      const allowedOrderStatuses = [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ];

      if (!allowedOrderStatuses.includes(req.query.orderStatus)) {
        return res.status(400).json({
          success: false,
          message: "Invalid order status.",
        });
      }

      filter.orderStatus = req.query.orderStatus;
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        limit,
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
};


// GET SINGLE ORDER DETAILS
exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order details.",
    });
  }
};


// UPDATE ORDER DELIVERY STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      orderStatus,
      courierName,
      trackingNumber,
      trackingUrl,
      estimatedDeliveryDate,
      message,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID.",
      });
    }

    const allowedStatuses = [
      "confirmed",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
    ];

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order delivery status.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Only successfully paid orders can be dispatched.
    if (order.status !== "paid") {
      return res.status(409).json({
        success: false,
        message: "Only paid orders can be processed for delivery.",
      });
    }

   const statusFlow = {
  pending: ["confirmed", "processing"],
  confirmed: ["processing"],
  processing: ["shipped"],
  shipped: ["out_for_delivery"],
  out_for_delivery: ["delivered"],
  delivered: [],
};

    const currentStatus = order.orderStatus || "confirmed";

    // Allow updating delivery details without changing status.
    if (
      orderStatus !== currentStatus &&
      !statusFlow[currentStatus]?.includes(orderStatus)
    ) {
      return res.status(409).json({
        success: false,
        message: `Cannot move order from ${currentStatus} to ${orderStatus}.`,
      });
    }

    if (courierName !== undefined) {
      order.courierName = String(courierName).trim();
    }

    if (trackingNumber !== undefined) {
      order.trackingNumber = String(trackingNumber).trim();
    }

    if (trackingUrl !== undefined) {
      const url = String(trackingUrl).trim();

      if (url) {
        try {
          const parsedUrl = new URL(url);

          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            throw new Error("Invalid protocol");
          }
        } catch {
          return res.status(400).json({
            success: false,
            message: "Enter a valid tracking URL.",
          });
        }
      }

      order.trackingUrl = url;
    }

    if (estimatedDeliveryDate !== undefined) {
      if (estimatedDeliveryDate === null || estimatedDeliveryDate === "") {
        order.estimatedDeliveryDate = null;
      } else {
        const date = new Date(estimatedDeliveryDate);

        if (Number.isNaN(date.getTime())) {
          return res.status(400).json({
            success: false,
            message: "Invalid estimated delivery date.",
          });
        }

        order.estimatedDeliveryDate = date;
      }
    }

    if (
      orderStatus === "shipped" &&
      (!order.courierName || !order.trackingNumber)
    ) {
      return res.status(400).json({
        success: false,
        message: "Courier name and tracking number are required before shipping.",
      });
    }

    if (orderStatus !== currentStatus) {
      order.orderStatus = orderStatus;

      const now = new Date();

      if (orderStatus === "shipped") {
        order.shippedAt = now;
      }

      if (orderStatus === "delivered") {
        order.deliveredAt = now;
      }

      if (!Array.isArray(order.trackingHistory)) {
  order.trackingHistory = [];
}

      order.trackingHistory.push({
        status: orderStatus,
        message:
          typeof message === "string" && message.trim()
            ? message.trim()
            : `Order status updated to ${orderStatus.replaceAll("_", " ")}.`,
        updatedAt: now,
      });
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  }
};
