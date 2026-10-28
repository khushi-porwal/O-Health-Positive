
const ImpactStat = require("../../models/stat/ImpactStat");

// GET: Fetch public impact statistics
const getImpactStats = async (req, res) => {
  try {
    const stats = await ImpactStat.findOne().lean();

    if (!stats) {
      return res.status(200).json({
        success: true,
        data: {
          fundsRaised: 0,
          successfulCampaigns: 0,
          monthlyDonors: 0,
          livesImpacted: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        fundsRaised: stats.fundsRaised ?? 0,
        successfulCampaigns: stats.successfulCampaigns ?? 0,
        monthlyDonors: stats.monthlyDonors ?? 0,
        livesImpacted: stats.livesImpacted ?? 0,
      },
    });
  } catch (error) {
    console.error("Get Impact Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch impact statistics",
    });
  }
};

// POST: Admin creates impact statistics for the first time
const createImpactStats = async (req, res) => {
  try {
    const fields = [
      "fundsRaised",
      "successfulCampaigns",
      "monthlyDonors",
      "livesImpacted",
    ];

    const values = {};

    // Validate all required fields
    for (const field of fields) {
      const value = req.body[field];

      if (
        value === undefined ||
        value === null ||
        value === "" ||
        !Number.isFinite(Number(value)) ||
        Number(value) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a valid non-negative number`,
        });
      }

      values[field] = Number(value);
    }

    // These three statistics must be whole numbers
    for (const field of [
      "successfulCampaigns",
      "monthlyDonors",
      "livesImpacted",
    ]) {
      if (!Number.isInteger(values[field])) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a whole number`,
        });
      }
    }

    // Prevent creating a second statistics document
    const existingStats = await ImpactStat.findOne().lean();

    if (existingStats) {
      return res.status(409).json({
        success: false,
        message:
          "Impact statistics already exist. Use the update endpoint instead.",
      });
    }

    const stats = await ImpactStat.create(values);

    return res.status(201).json({
      success: true,
      message: "Impact statistics created successfully",
      data: {
        fundsRaised: stats.fundsRaised,
        successfulCampaigns: stats.successfulCampaigns,
        monthlyDonors: stats.monthlyDonors,
        livesImpacted: stats.livesImpacted,
      },
    });
  } catch (error) {
    console.error("Create Impact Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create impact statistics",
    });
  }
};

// PUT: Admin updates existing impact statistics
const updateImpactStats = async (req, res) => {
  try {
    const fields = [
      "fundsRaised",
      "successfulCampaigns",
      "monthlyDonors",
      "livesImpacted",
    ];

    const updates = {};

    for (const field of fields) {
      const value = req.body[field];

      if (
        value === undefined ||
        value === null ||
        value === "" ||
        !Number.isFinite(Number(value)) ||
        Number(value) < 0
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a valid non-negative number`,
        });
      }

      updates[field] = Number(value);
    }

    for (const field of [
      "successfulCampaigns",
      "monthlyDonors",
      "livesImpacted",
    ]) {
      if (!Number.isInteger(updates[field])) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a whole number`,
        });
      }
    }

    const stats = await ImpactStat.findOneAndUpdate(
      {},
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!stats) {
      return res.status(404).json({
        success: false,
        message: "Impact statistics not found. Create them first.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Impact statistics updated successfully",
      data: {
        fundsRaised: stats.fundsRaised,
        successfulCampaigns: stats.successfulCampaigns,
        monthlyDonors: stats.monthlyDonors,
        livesImpacted: stats.livesImpacted,
      },
    });
  } catch (error) {
    console.error("Update Impact Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update impact statistics",
    });
  }
};

module.exports = {
  getImpactStats,
  createImpactStats,
  updateImpactStats
};
