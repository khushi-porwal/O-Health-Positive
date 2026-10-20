
const express = require("express");

const {
  registerVolunteer,
  getVolunteers,
  updateVolunteerStatus,
  deleteVolunteer,
} = require("../../controllers/volunteer/VolunteerController");

const { protectAdmin } = require("../../middleware/auth/authMiddleware");

const router = express.Router();

// Public route: anyone can submit an application
router.post("/register", registerVolunteer);

// Admin-protected routes
router.get("/", protectAdmin, getVolunteers);

router.patch("/:id/status", protectAdmin, updateVolunteerStatus);

router.delete("/:id", protectAdmin, deleteVolunteer);

module.exports = router;
