
const express = require("express");
const router = express.Router();

const {
  getMonthlyPrograms,
  getAllMonthlyPrograms,
  createMonthlyProgram,
  updateMonthlyProgram,
  deleteMonthlyProgram,
} = require("../../controllers/monthly/monthlyProgramController");

// Apne project ke actual middleware path ke according adjust karein.
const {protectAdmin} = require("../../middleware/auth/authMiddleware");

// Public route
router.get("/monthly-programs", getMonthlyPrograms);

// Protected admin routes
router.get(
  "/admin/monthly-programs",
  protectAdmin,
  getAllMonthlyPrograms
);

router.post(
  "/admin/monthly-programs",
  protectAdmin,
  createMonthlyProgram
);

router.patch(
  "/admin/monthly-programs/:id",
  protectAdmin,
  updateMonthlyProgram
);

router.delete(
  "/admin/monthly-programs/:id",
  protectAdmin,
  deleteMonthlyProgram
);

module.exports = router;
