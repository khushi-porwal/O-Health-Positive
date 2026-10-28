
const express = require("express");
const router = express.Router();

const {
  getImpactStats,
  createImpactStats,
  updateImpactStats,
} = require("../../controllers/stat/impactController");

const {
  protectAdmin,
} = require("../../middleware/auth/authMiddleware");

// Public: Fetch impact statistics
router.get("/impact-stats", getImpactStats);

// Admin only: Create statistics
router.post("/impact-stats", protectAdmin, createImpactStats);

// Admin only: Update statistics
router.put("/impact-stats", protectAdmin, updateImpactStats);

module.exports = router;
