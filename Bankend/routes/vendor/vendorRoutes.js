
const express = require("express");
const router = express.Router();

const {
  getFeaturedVendors,
  getVendorProducts,
  createNomination,
  getAllNominations,
  updateNominationStatus,
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} = require("../../controllers/vendor/vendorController");

const {
  protectAdmin,
} = require("../../middleware/auth/authMiddleware");

// ==================== PUBLIC APIs ====================

// Featured vendors for public website
router.get("/featured", getFeaturedVendors);

// Products belonging to a specific approved vendor
// GET /api/vendors/:id/products
router.get("/:id/products", getVendorProducts);

// Public vendor nomination form
router.post("/nominate", createNomination);

// ==================== ADMIN-ONLY APIs ====================

// Vendor nominations
router.get(
  "/admin/nominations",
  protectAdmin,
  getAllNominations
);

router.patch(
  "/admin/nominations/:id/status",
  protectAdmin,
  updateNominationStatus
);

// Vendor management
router.get("/admin", protectAdmin, getAllVendors);
router.post("/admin", protectAdmin, createVendor);
router.patch("/admin/:id", protectAdmin, updateVendor);
router.delete("/admin/:id", protectAdmin, deleteVendor);

module.exports = router;
