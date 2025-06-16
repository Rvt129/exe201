const Feedback = require("../models/Feedback");
const Order = require("../models/Order");
const asyncHandler = require("express-async-handler");

// @desc    Create new feedback
// @route   POST /api/feedbacks
// @access  Private (User)
const createFeedback = asyncHandler(async (req, res) => {
  const { orderId, rating, comment } = req.body;
  const userId = req.user._id; // Assuming user ID is available from auth middleware

  if (!orderId || !rating) {
    res.status(400);
    throw new Error("Order ID and rating are required");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Check if the user owns the order
  if (order.user.toString() !== userId.toString()) {
    res.status(401);
    throw new Error("User not authorized to feedback this order");
  }

  // Check if feedback already exists for this order by this user
  const existingFeedback = await Feedback.findOne({
    order: orderId,
    user: userId,
  });
  if (existingFeedback) {
    res.status(400);
    throw new Error("Feedback already submitted for this order");
  }

  const feedback = new Feedback({
    order: orderId,
    user: userId,
    rating,
    comment,
  });

  const createdFeedback = await feedback.save();

  // Optionally, update the order to mark that feedback has been given
  order.hasFeedback = true;
  await order.save();

  res.status(201).json(createdFeedback);
});

// @desc    Get all feedbacks
// @route   GET /api/feedbacks
// @access  Private (Admin)
const getFeedbacks = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({})
    .populate("user", "email profile.firstName profile.lastName")
    .populate("order", "orderNumber")
    .sort({ createdAt: -1 }); // Sort by newest first

  console.log("Fetched feedbacks:", feedbacks);
  res.json(feedbacks);
});

// @desc    Get feedback by Order ID
// @route   GET /api/feedbacks/order/:orderId
// @access  Private
const getFeedbackByOrder = asyncHandler(async (req, res) => {
  const feedback = await Feedback.find({ order: req.params.orderId }).populate(
    "user",
    "name email"
  );
  if (feedback) {
    res.json(feedback);
  } else {
    res.status(404);
    throw new Error("Feedback not found for this order");
  }
});

// @desc    Get feedback by User ID
// @route   GET /api/feedbacks/user/:userId
// @access  Private
const getFeedbackByUser = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({ user: req.params.userId }).populate(
    "order",
    "orderNumber"
  );
  if (feedbacks) {
    res.json(feedbacks);
  } else {
    res.status(404);
    throw new Error("No feedback found for this user");
  }
});

module.exports = {
  createFeedback,
  getFeedbacks,
  getFeedbackByOrder,
  getFeedbackByUser,
};
