const express = require("express");
const router = express.Router();
const {createContact, getContacts, getContactById, updateContactStatus, deleteContact} = require("../../controllers/contact/contactController")

const {protectAdmin} = require("../../middleware/auth/authMiddleware");

//Public route
router.post("/create-contact", createContact)

// Admin-only routes
router.get("/", protectAdmin, getContacts);
router.get("/:id", protectAdmin, getContactById);
router.patch("/:id/status", protectAdmin, updateContactStatus);
router.delete("/:id", protectAdmin, deleteContact);

module.exports = router;