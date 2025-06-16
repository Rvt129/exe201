const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  changePassword,
  toggle2FA,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

// Public routes
router.post("/", registerUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route("/addresses")
  .get(protect, getUserAddresses)
  .post(protect, addUserAddress);

router
  .route("/addresses/:id")
  .put(protect, updateUserAddress)
  .delete(protect, deleteUserAddress);

router.put("/addresses/:id/default", protect, setDefaultAddress);
router.put("/password", protect, changePassword);
router.put("/2fa", protect, toggle2FA);

// Admin routes
router.route("/").get(protect, admin, getUsers);

router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

module.exports = router;
