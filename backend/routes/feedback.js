const express = require("express");
const router = express.Router();
const {
  createFeedback,
  getFeedbacks,
  getFeedbackByOrder,
  getFeedbackByUser,
} = require("../controllers/feedbackController");
const { protect, admin } = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, createFeedback)
  .get(protect, admin, getFeedbacks);
router.route("/order/:orderId").get(protect, getFeedbackByOrder);
router.route("/user/:userId").get(protect, getFeedbackByUser); // Could be admin or user checking their own feedback

module.exports = router;
