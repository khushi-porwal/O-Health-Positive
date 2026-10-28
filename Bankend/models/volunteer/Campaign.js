
const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    campaignerName: {
      type: String,
      required: [true, "Campaigner name is required"],
      trim: true,
      maxlength: 100,
    },

    cause: {
      type: String,
      required: [true, "Please select a social cause"],
      enum: [
        "healthcare",
        "education",
        "hunger",
        "women",
        "disability",
        "community",
        "other",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Enter a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: 20,
    },

    socialLinks: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
      validate: {
        validator: (links) => links.length <= 10,
        message: "Maximum 10 social links are allowed",
      },
    },

    description: {
      type: String,
      required: [true, "Campaign description is required"],
      trim: true,
      maxlength: 1500,
    },

    acceptedTerms: {
      type: Boolean,
      required: true,
      validate: {
        validator: (value) => value === true,
        message: "Terms and Privacy Policy must be accepted",
      },
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);
