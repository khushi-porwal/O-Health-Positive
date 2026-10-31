
const mongoose = require("mongoose");

// Individual products inside an order
const orderItemSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    vendorName: {
      type: String,
      required: true,
      trim: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

// Customer delivery details
const deliveryDetailsSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

// Order tracking history
const trackingHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      required: true,
    },
    message: {
      type: String,
      trim: true,
      default: "",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Main order schema
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    deliveryDetails: {
      type: deliveryDetailsSchema,
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) =>
          Array.isArray(items) && items.length > 0,
        message: "An order must contain at least one item",
      },
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: "INR",
      enum: ["INR"],
    },

    // Payment status - keep separate from delivery status
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    paymentProvider: {
      type: String,
      enum: ["phonepe"],
      default: "phonepe",
    },

    merchantOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },

    paymentReference: {
      type: String,
      default: "",
    },

    paymentDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    paidAt: {
      type: Date,
      default: null,
    },

    // --------------------------------
    // ORDER DELIVERY TRACKING
    // --------------------------------

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },

    courierName: {
      type: String,
      trim: true,
      default: "",
    },

    trackingNumber: {
      type: String,
      trim: true,
      default: "",
    },

    trackingUrl: {
      type: String,
      trim: true,
      default: "",
    },

    shippedAt: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },

    trackingHistory: {
      type: [trackingHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
