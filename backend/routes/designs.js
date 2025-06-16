const express = require("express");
const router = express.Router();
const {
  createDesign,
  getUserDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  getPublicDesigns,
  convertDesignToProduct,
  getAllDesignsForAdmin,
  uploadImage,
} = require("../controllers/designController");
const { protect, admin } = require("../middleware/authMiddleware");


// Public: Xem các thiết kế public
router.get("/public", getPublicDesigns);

// Admin: Get all designs with pagination
router.get("/admin/all", protect, admin, getAllDesignsForAdmin);

// Protected: CRUD design cá nhân
router.post("/", protect, createDesign);
router.post("/upload-image", protect, uploadImage);
router.get("/my", protect, getUserDesigns);
router.get("/:id", protect, getDesignById);
router.put("/:id", protect, updateDesign);
router.delete("/:id", protect, deleteDesign);
// Chuyển thiết kế thành sản phẩm cho giỏ hàng
router.post("/:id/to-product", protect, convertDesignToProduct);

module.exports = router;
