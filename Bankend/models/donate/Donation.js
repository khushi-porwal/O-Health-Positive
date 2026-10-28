
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
      min: 500,
      validate: {
        validator: Number.isInteger,
        message: "Donation amount must be an integer.",
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
    },

    paymentProvider: {
      type: String,
      default: null,
    },

    paymentReference: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Donation", donationSchema);
