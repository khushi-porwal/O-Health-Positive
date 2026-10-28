
const Campaign = require("../../models/campaign/Camp");

console.log("Campaign model path:", require.resolve("../../models/campaign/Camp"));
console.log("Campaign schema fields:", Object.keys(Campaign.schema.paths));
console.log("Campaign model name:", Campaign.modelName);
// PUBLIC: Get active campaigns
exports.getPublicCampaigns = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = { status: "active" };

    if (category) {
      filter.category = category;
    }

    const campaigns = await Campaign.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const result = campaigns.map((campaign) => ({
      ...campaign,
      percent: Math.min(
        100,
        Math.round(
          (campaign.raisedAmount / campaign.goalAmount) * 100
        )
      ),
    }));

    res.status(200).json({
      success: true,
      count: result.length,
      campaigns: result,
    });
  } catch (error) {
    console.error("Get campaigns error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch campaigns",
    });
  }
};

// ADMIN: Create campaign
exports.createCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      image,
      goalAmount,
    } = req.body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !category ||
      !image?.trim() ||
      goalAmount === undefined ||
      goalAmount === null ||
      goalAmount === "" ||
      !Number.isFinite(Number(goalAmount)) ||
      Number(goalAmount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid campaign details",
      });
    }

    const campaign = await Campaign.create({
      title: title.trim(),
      description: description.trim(),
      category,
      image: image.trim(),
      goalAmount: Number(goalAmount),
    });

    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create campaign error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to create campaign",
    });
  }
};

// ADMIN: Get all campaigns, including paused ones
exports.getAdminCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: campaigns.length,
      campaigns,
    });
  } catch (error) {
    console.error("Admin campaigns error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch admin campaigns",
    });
  }
};

// ADMIN: Update campaign details/status
exports.updateCampaign = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "category",
      "image",
      "goalAmount",
      "status",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (
      updates.goalAmount !== undefined &&
      (!Number.isFinite(Number(updates.goalAmount)) ||
        Number(updates.goalAmount) <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Goal amount must be greater than zero",
      });
    }

    if (updates.goalAmount !== undefined) {
      updates.goalAmount = Number(updates.goalAmount);
    }

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      campaign,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign data or ID",
      });
    }

    console.error("Update campaign error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to update campaign",
    });
  }
};

// ADMIN: Delete campaign
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign ID",
      });
    }

    console.error("Delete campaign error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to delete campaign",
    });
  }
};
