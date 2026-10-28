
const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Urgent",
        "Children",
        "Animals",
        "Disability",
        "Disaster Relief",
        "Education",
        "Elderly",
        "Faith",
        "Hunger",
        "Medical",
        "DIY",
        "Women",
        "Temples",
        "Community",
      ],
    },

    image: {
      type: String,
      required: true,
    },

    goalAmount: {
      type: Number,
      required: true,
      min: 1,
    },

    raisedAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    donorCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.AdminCampaign ||
  mongoose.model("AdminCampaign", campaignSchema);