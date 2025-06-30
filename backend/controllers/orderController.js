const Order = require("../models/Order");
const Cart = require("../models/Cart"); // Import Cart model
const mongoose = require("mongoose");
const payOS = require("../utils/payos");

// @desc    Get all orders for a user
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10, adjust as needed
    const skip = (page - 1) * limit;

    // For Admin, we might want to fetch all orders, not just for req.user._id
    // If you have an admin role check, you can modify the query filter
    // For now, let's assume this endpoint is for admin and fetches all orders.
    // If it's mixed, you'll need role-based logic.

    // const queryFilter = req.user.isAdmin ? {} : { user: req.user._id }; // Example if you have isAdmin
    const queryFilter = {}; // For admin, fetch all orders

    const orders = await Order.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "firstName lastName email phone"); // Populate user details

    const totalOrders = await Order.countDocuments(queryFilter);
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get orders for the logged-in user
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const queryFilter = { user: req.user._id }; // Filter by logged-in user

    const orders = await Order.find(queryFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "firstName lastName email phone"); // Populate user details

    const totalOrders = await Order.countDocuments(queryFilter);
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recent orders for a user (last 3)
// @route   GET /api/orders/recent
// @access  Private
const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, customer, shippingAddress, pricing, payment } = req.body;

    // Generate order number that meets PayOS constraints (max: 9007199254740991)
    // Use a more conservative approach to ensure we never exceed the limit
    const timestamp = Date.now();
    const randomPart = Math.floor(Math.random() * 1000); // 3 digits

    // Create a smaller number by using only the last 10 digits of timestamp
    const timestampStr = timestamp.toString();
    const shortTimestamp = parseInt(timestampStr.slice(-10)); // Last 10 digits

    // Combine short timestamp with random part, ensuring total stays under limit
    const orderNumber = parseInt(
      `${shortTimestamp}${randomPart.toString().padStart(3, "0")}`
    );

    // Additional safety check - if still too large, use a simpler approach
    const MAX_SAFE_ORDER_CODE = 9007199254740991;
    const finalOrderNumber =
      orderNumber > MAX_SAFE_ORDER_CODE
        ? Math.floor(Date.now() / 1000) % 1000000000 // Simple fallback
        : orderNumber;

    const order = await Order.create({
      user: req.user._id,
      orderNumber: finalOrderNumber,
      customer,
      items,
      shippingAddress,
      pricing,
      payment: {
        ...payment,
        status: "pending",
      },
      fulfillment: {
        status: "pending",
      },
    });

    // Clear the cart after successful order creation
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.total = 0;
      await cart.save();
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
const updateOrderPayment = async (req, res) => {
  try {
    const { status, transactionId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    order.payment.status = status;
    if (status === "completed") {
      order.payment.paidAt = Date.now();
    }

    if (transactionId) {
      order.payment.transactionId = transactionId;
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Only pending orders can be cancelled
    if (order.fulfillment.status !== "pending") {
      return res.status(400).json({ message: "Order cannot be cancelled" });
    }

    order.fulfillment.status = "cancelled";
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order fulfillment status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, notes } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate status
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Update fulfillment status
    order.fulfillment.status = status;
    order.metadata.updatedAt = Date.now();

    // Nếu admin cập nhật trạng thái đã giao hàng thì tự động cập nhật payment.status
    if (status === "delivered") {
      order.payment.status = "completed";
      if (!order.payment.paidAt) {
        order.payment.paidAt = Date.now();
      }
    }

    // Set specific timestamps based on status
    if (status === "shipped" && !order.fulfillment.shippedAt) {
      order.fulfillment.shippedAt = Date.now();
    }
    if (status === "delivered" && !order.fulfillment.deliveredAt) {
      order.fulfillment.deliveredAt = Date.now();
    }

    // Update tracking number if provided
    if (trackingNumber) {
      order.fulfillment.trackingNumber = trackingNumber;
    }

    // Update notes if provided
    if (notes) {
      order.fulfillment.notes = notes;
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create payOS payment link
// POST /api/orders/payos/create
const createPayOSPaymentLink = async (req, res) => {
  let { description, returnUrl, cancelUrl, amount, orderNumber } = req.body;

  try {
    // Validate required fields
    if (!description || !returnUrl || !cancelUrl || !amount || !orderNumber) {
      return res.status(400).json({
        error: -1,
        message: "Missing required fields",
        data: null,
      });
    }

    // Ensure orderCode is within PayOS constraints
    const MAX_SAFE_ORDER_CODE = 9007199254740991;
    let payOSOrderCode = orderNumber;

    // If orderNumber is too large, create a safe alternative
    if (payOSOrderCode > MAX_SAFE_ORDER_CODE || payOSOrderCode <= 0) {
      // Create a smaller, positive number based on timestamp
      const timestamp = Date.now();
      const randomPart = Math.floor(Math.random() * 1000);
      payOSOrderCode = (Math.floor(timestamp / 1000) % 1000000000) + randomPart;
    }

    // Ensure it's a positive integer
    payOSOrderCode = Math.abs(Math.floor(payOSOrderCode));

    const EXPIRE_MINUTES = 15;
    const expiredAt = Math.floor(
      (Date.now() + EXPIRE_MINUTES * 60 * 1000) / 1000
    );

    const body = {
      orderCode: payOSOrderCode,
      amount,
      description: description,
      cancelUrl,
      returnUrl,
      expiredAt,
    };

    console.log("PayOS Request Body:", body); // Debug log

    const paymentLinkRes = await payOS.createPaymentLink(body);

    return res.json({
      error: 0,
      message: "Success",
      data: {
        bin: paymentLinkRes.bin,
        checkoutUrl: paymentLinkRes.checkoutUrl,
        accountNumber: paymentLinkRes.accountNumber,
        accountName: paymentLinkRes.accountName,
        amount: paymentLinkRes.amount,
        description: paymentLinkRes.description,
        orderCode: paymentLinkRes.orderCode,
        qrCode: paymentLinkRes.qrCode,
        expiredAt: paymentLinkRes.expiredAt,
      },
    });
  } catch (error) {
    console.error("Error in createPayOSPaymentLink:", error);

    if (error.isAxiosError && error.response && error.response.data) {
      const payOSError = error.response.data;
      return res.status(400).json({
        error: -1,
        message:
          payOSError.message ||
          "Failed to create PayOS payment link due to PayOS error.",
        data: payOSError,
      });
    } else if (
      error.message &&
      error.message.includes("order_code must not be greater than")
    ) {
      return res.status(400).json({
        error: -1,
        message: "PayOS order code constraint violation: " + error.message,
        data: null,
      });
    }

    return res.status(500).json({
      error: -1,
      message: "Internal server error while creating PayOS payment link.",
      data: null,
    });
  }
};

// New controller function to get system's MongoDB Order ID by PayOS numeric order code
// GET /api/orders/payos/get-system-order-id/:payOSNumericOrderCode
const getSystemOrderIdByPayOSCode = async (req, res) => {
  try {
    const { payOSNumericOrderCode } = req.params;
    if (!payOSNumericOrderCode || isNaN(parseInt(payOSNumericOrderCode))) {
      return res.status(400).json({
        error: -1,
        message: "Invalid PayOS numeric order code provided.",
        data: null,
      });
    }

    const order = await Order.findOne({
      "paymentDetails.payOSOrderCode": Number(payOSNumericOrderCode),
    });
    console.log("Found order:", order);

    if (!order) {
      return res.status(404).json({
        error: -1,
        message: "Order not found for the given PayOS numeric order code.",
        data: null,
      });
    }

    return res.json({
      error: 0,
      message: "Success",
      data: { systemOrderId: order._id }, // Return the MongoDB ObjectId string
    });
  } catch (error) {
    console.error("Error fetching system order ID by PayOS code:", error);
    return res
      .status(500)
      .json({ error: -1, message: "Internal server error.", data: null });
  }
};

// Get payOS payment link info
// GET /api/orders/payos/:orderId
const getPayOSPaymentLinkInfo = async (req, res) => {
  try {
    // req.params.orderId here is the PayOS internal ID (paymentLinkId),
    // NOT our system's order _id or the orderCode we sent to PayOS.
    // The frontend should pass the PayOS transaction ID (often called 'id' or 'paymentLinkId' in PayOS redirect/response)
    const payOSPaymentId = req.params.orderId;
    const orderInfo = await payOS.getPaymentLinkInformation(payOSPaymentId);
    if (!orderInfo) {
      return res.json({
        error: -1,
        message:
          "Failed to get PayOS payment link information or link not found",
        data: null,
      });
    }
    // orderInfo here contains details from PayOS, including the orderCode we originally sent (which is our system's MongoDB _id)
    return res.json({
      error: 0,
      message: "ok",
      data: orderInfo, // Contains { ..., orderCode: ourSystemMongoDbId, status: "PAID", ... }
    });
  } catch (error) {
    console.log(error);
    return res.json({
      error: -1,
      message: "failed",
      data: null,
    });
  }
};

// Cancel payOS payment link
// PUT /api/orders/payos/:orderId
const cancelPayOSPaymentLink = async (req, res) => {
  try {
    // req.params.orderId here is the PayOS internal ID (paymentLinkId)
    const payOSPaymentId = req.params.orderId;
    const body = req.body;
    const cancelledOrderInfo = await payOS.cancelPaymentLink(
      payOSPaymentId,
      body.cancellationReason
    );
    if (!cancelledOrderInfo) {
      return res.json({
        error: -1,
        message: "Failed to cancel PayOS payment link or link not found",
        data: null,
      });
    }
    return res.json({
      error: 0,
      message: "ok",
      data: cancelledOrderInfo,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      error: -1,
      message: "failed",
      data: null,
    });
  }
};

// POST /api/orders/payos/webhook
const payOSWebhookHandler = async (req, res) => {
  try {
    // Đây chính là hàm xử lý "callback hệ thống"
    const webhookData = req.body;
    payOS.verifyPaymentWebhookData(
      webhookData,
      req.headers["x-payos-signature"]
    );

    // Lấy thông tin đơn hàng từ webhookData
    const orderCode = webhookData.data.orderCode; // Assuming this is the PayOS numeric order code
    console.log(`Received PayOS webhook for order code: ${webhookData}`);
    const order = await Order.findOne({
      orderNumber: orderCode,
    });
    if (!order) {
      console.error(
        `Order not found for PayOS numeric order code: ${orderCode}`
      );
      return res.status(404).json({ message: "Order not found" });
    }
    // Update order status based on webhook data
    const payOSStatus = webhookData.success; // Assuming this is the status from PayOS
    if (payOSStatus) {
      order.payment.status = "completed";
      order.metadata.updatedAt = Date.now();
      order.fulfillment.status = "processing"; // Update order status to Processing or similar
    } else if (payOSStatus) {
      order.payment.status = "cancelled";
      order.fulfillment.status = "cancelled"; // Update order status to Cancelled
    }
    // Add any other status handling as needed
    await order.save();
    console.log(
      `Order ${order._id} updated successfully based on PayOS webhook data.`
    );
    // Respond to PayOS to acknowledge receipt of the webhook

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    res.status(400).json({ message: "Failed" });
  }
};

// Confirm payOS webhook
// POST /api/orders/payos/confirm-webhook
const confirmPayOSWebhook = async (req, res) => {
  const { webhookUrl } = req.body;
  try {
    await payOS.confirmWebhook(webhookUrl);
    return res.json({
      error: 0,
      message: "ok",
      data: null,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      error: -1,
      message: "failed",
      data: null,
    });
  }
};

// @desc    Confirm order payment after redirect and verification
// @route   PUT /api/orders/:id/confirm-payment
// @access  Private
const confirmOrderPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "firstName lastName email"
    );

    if (order) {
      // Check if order already paid to prevent multiple updates
      if (
        order.paymentDetails &&
        order.paymentDetails.status === "Paid" &&
        order.status !== "Pending Payment" // Allow update if it was pending despite being "Paid" in details
      ) {
        // If already fully processed as Paid, just return.
        // If it was "Paid" in details but order status was still "Pending Payment", allow reprocessing.
        if (order.status !== "Pending Payment") {
          return res.json({
            message: "Order already marked as paid and processed.",
            order,
          });
        }
      }

      order.paymentDetails = {
        ...order.paymentDetails,
        status: "Paid",
        paymentDate: Date.now(),
        transactionId: req.body.transactionId, // e.g., PayOS orderCode
        paymentMethod: req.body.paymentMethod || "bank",
      };
      order.status = "Processing"; // Or any status that signifies successful payment

      // Clear cart if the order was from cart and payment is now confirmed
      if (order.source === "cart" && order.user) {
        await Cart.deleteOne({ user: order.user });
      }

      const updatedOrder = await order.save();
      // TODO: Add any post-payment logic here (e.g., sending confirmation email)
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    res
      .status(500)
      .json({ message: `Error confirming payment: ${error.message}` });
  }
};

module.exports = {
  getOrders,
  getMyOrders, // Add getMyOrders
  getRecentOrders,
  getOrderById,
  createOrder,
  updateOrderPayment,
  cancelOrder,
  updateOrderStatus, // Export new function
  // payOS
  createPayOSPaymentLink,
  getPayOSPaymentLinkInfo,
  cancelPayOSPaymentLink,
  confirmPayOSWebhook,
  payOSWebhookHandler,
  confirmOrderPayment, // Add confirmOrderPayment
  getSystemOrderIdByPayOSCode, // Export new function
};
