const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

// Lấy giỏ hàng và thêm sản phẩm vào giỏ hàng
router.route("/").get(protect, getCart).post(protect, addToCart);

// Cập nhật số lượng/xóa sản phẩm khỏi giỏ hàng
router
  .route("/:itemId")
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

module.exports = router;
