const express = require("express");
const router = express.Router();
const payOS = require("../utils/payos");
const Order = require("../models/Order"); // Thêm dòng này

// Webhook endpoint to handle payOS payment notifications
router.post("/payos", async function (req, res) {
  console.log("payment handler");
  const webhookData = payOS.verifyPaymentWebhookData(req.body);

  // Example: filter out test transactions
  if (
    ["Ma giao dich thu nghiem", "VQRIO123"].includes(webhookData.description)
  ) {
    return res.json({
      error: 0,
      message: "Ok",
      data: webhookData,
    });
  }

  // --- BỔ SUNG: Tự động cập nhật trạng thái đơn hàng ---
  try {
    // Giả sử description là orderNumber, hoặc bạn có thể dùng orderCode nếu bạn lưu nó vào Order
    const order = await Order.findOne({ orderNumber: webhookData.description });
    if (order) {
      order.payment.status = "completed";
      order.payment.paidAt = new Date();
      order.payment.transactionId =
        webhookData.transactionId ||
        webhookData.transId ||
        webhookData.orderCode;
      // Nếu muốn cập nhật fulfillment status:
      if (order.fulfillment) order.fulfillment.status = "paid";
      await order.save();
    }
  } catch (err) {
    console.error("Webhook update order error:", err);
  }
  // --- END BỔ SUNG ---

  // Handle real payment webhook data here
  return res.json({
    error: 0,
    message: "Ok",
    data: webhookData,
  });
});

module.exports = router;
