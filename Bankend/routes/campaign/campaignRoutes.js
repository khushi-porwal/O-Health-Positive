
const express = require("express");
const router = express.Router();

const {
  getPublicCampaigns,
  createCampaign,
  getAdminCampaigns,
  updateCampaign,
  deleteCampaign,
} = require("../../controllers/campaign/campaignController");

// Apne existing admin authentication middleware ka path use karo.
const {protectAdmin} = require("../../middleware/auth/authMiddleware");

// Public routes
router.get("/", getPublicCampaigns);

// Protected admin routes
router.get("/admin", protectAdmin, getAdminCampaigns);
router.post("/", protectAdmin, createCampaign);
router.patch("/:id", protectAdmin, updateCampaign);
router.delete("/:id", protectAdmin, deleteCampaign);

module.exports = router;
