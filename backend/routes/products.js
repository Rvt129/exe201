const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  getCustomizableProducts,
  getProductPricing,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/customizable", getCustomizableProducts);
router.get("/:id", getProductById);
router.get("/:id/pricing/:petType", getProductPricing);

// Protected routes (admin)
router.post("/", protect, admin, createProduct);

module.exports = router;
