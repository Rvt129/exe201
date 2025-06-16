const express = require("express");
const router = express.Router();
const { getRevenueStats } = require("../controllers/revenueController");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/revenue/stats
router.get("/stats", protect, admin, getRevenueStats);

module.exports = router;
