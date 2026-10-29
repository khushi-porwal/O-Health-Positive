
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 20,
    },

    amount: {
      type: Number,
      required: true,
      min: 99,
      validate: {
        validator: Number.isSafeInteger,
        message: "Donation amount must be a whole number.",
      },
    },

    donationType: {
      type: String,
      enum: ["once", "monthly"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      index: true,
    },

    // Payment gateway
    paymentProvider: {
      type: String,
      enum: ["phonepe", "razorpay", null],
      default: null,
    },

    // Unique merchant order ID sent to PhonePe
    paymentOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // PhonePe transaction ID after payment processing
    paymentReference: {
      type: String,
      unique: true,
      sparse: true,
    },

    // PhonePe merchant order ID, if stored separately
    merchantOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Prevent duplicate order creation on retries
    idempotencyKey: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      select: false,
    },

    currency: {
      type: String,
      default: "INR",
      enum: ["INR"],
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donation", donationSchema);
