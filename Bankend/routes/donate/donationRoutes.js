const express = require("express");
const router = express.Router();
const {createDonation} = require("../../controllers/donate/donationController");

router.post("/create-donate", createDonation);

module.exports = router;