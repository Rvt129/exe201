const express = require("express");
const router = express.Router();
const {
  getOrders,
  getMyOrders, // Import getMyOrders
  getRecentOrders,
  getOrderById,
  createOrder,
  updateOrderPayment,
  cancelOrder,
  updateOrderStatus, // Import new function
  // payOS
  createPayOSPaymentLink,
  getPayOSPaymentLinkInfo,
  cancelPayOSPaymentLink,
  confirmPayOSWebhook,
  payOSWebhookHandler,
  confirmOrderPayment,
  getSystemOrderIdByPayOSCode, // Import new function
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").get(protect, admin, getOrders).post(protect, createOrder);

router.get("/my", protect, getMyOrders); // Add route for getMyOrders
router.get("/recent", protect, admin, getRecentOrders);

router.get("/payos-webhook", (req, res) => {
  res.status(200).json({ message: "PayOS webhook endpoint" });
});

router.route("/:id").get(protect, getOrderById);

router.route("/:id/payment").put(protect, updateOrderPayment);

router.route("/:id/cancel").put(protect, cancelOrder);

// Add PATCH route for cancel order
router.route("/:id/cancel").patch(protect, cancelOrder);

// Admin route to update order status
router.route("/:id/status").put(protect, admin, updateOrderStatus);

// payOS endpoints
router.post("/payos/create", createPayOSPaymentLink);
// New route to get system Order ID from PayOS numeric code
router.get(
  "/payos/get-system-order-id/:payOSNumericOrderCode",
  protect,
  admin,
  getSystemOrderIdByPayOSCode
);

router.get("/payos/:orderId", getPayOSPaymentLinkInfo);
router.put("/payos/:orderId", cancelPayOSPaymentLink);
router.post("/payos/confirm-webhook", confirmPayOSWebhook);

// PayOS webhook endpoint: cập nhật trạng thái đơn hàng khi PayOS gửi thông báo
const bodyParser = require("body-parser");

router.post(
  "/payos-webhook",
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  payOSWebhookHandler
);
module.exports = router;
