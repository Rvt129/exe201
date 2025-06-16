const express = require("express");
const router = express.Router();
const {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
} = require("../controllers/contactController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/", createContact);

// Protected routes (admin only)
router.route("/").get(protect, admin, getContacts);

router
  .route("/:id")
  .get(protect, admin, getContactById)
  .put(protect, admin, updateContactStatus);

module.exports = router;
