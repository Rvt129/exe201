const express = require("express");
const router = express.Router();
const {
  getOrders,
  getRecentOrders,
  createOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getOrders).post(protect, createOrder);

router.get("/recent", protect, getRecentOrders);

module.exports = router;
