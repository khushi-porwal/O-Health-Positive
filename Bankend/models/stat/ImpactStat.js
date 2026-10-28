
const mongoose = require("mongoose");

const impactStatSchema = new mongoose.Schema(
  {
    fundsRaised: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Funds raised cannot be negative"],
    },

    successfulCampaigns: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Successful campaigns cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Successful campaigns must be a whole number",
      },
    },

    monthlyDonors: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Monthly donors cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Monthly donors must be a whole number",
      },
    },

    livesImpacted: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Lives impacted cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Lives impacted must be a whole number",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("ImpactStat", impactStatSchema);
