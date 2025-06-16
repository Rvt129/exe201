const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Webhook endpoint to handle payOS payment notifications
router.post("/payos", paymentController);

module.exports = router;
