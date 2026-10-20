
const express = require("express");
const router = express.Router();

const {
  chatWithGemini,
} = require("../../controllers/chatbot/chatbotController");

router.post("/", chatWithGemini);

module.exports = router;
