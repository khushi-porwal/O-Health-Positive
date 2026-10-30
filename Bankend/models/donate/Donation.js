
const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    // Donor Information
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
      maxlength: 10,
    },

    // Donation Amount (INR)
    amount: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isSafeInteger,
        message: "Donation amount must be a whole number.",
      },
    },

    // Donation Type
    donationType: {
      type: String,
      enum: ["once", "monthly"],
      required: true,
    },

    // Donation Status
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      index: true,
    },

    // Payment Provider
    paymentProvider: {
      type: String,
      enum: ["phonepe", "razorpay", null],
      default: null,
    },

    // Payment Order ID
    paymentOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Actual Gateway Transaction Reference
    paymentReference: {
      type: String,
      unique: true,
      sparse: true,
    },

    // PhonePe Merchant Order ID
    merchantOrderId: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Prevent Duplicate Payment Requests
    idempotencyKey: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      select: false,
    },

    // Currency
    currency: {
      type: String,
      default: "INR",
      enum: ["INR"],
    },

    // Successful Payment Date
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
