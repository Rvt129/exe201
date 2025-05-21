import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    // Calculate totals whenever cart items change
    const newSubtotal = cartItems.reduce(
      (sum, item) => sum + item.price + item.customizationFee,
      0
    );
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + shippingFee);
  }, [cartItems, shippingFee]);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  const handleApplyPromo = () => {
    // Implement promo code logic here
    alert("Tính năng mã khuyến mãi sẽ sớm có!");
  };

  const handleCheckout = () => {
    navigate("/order");
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        {/* Left Section - Cart Items */}
        <div className="cart-items">
          <h2>Giỏ hàng của bạn</h2>
          {cartItems.length === 0 ? (
            <p className="empty-cart">Giỏ hàng trống</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-preview">
                  <div className="preview-placeholder">Xem thiết kế</div>
                </div>
                <div className="item-details">
                  <p className="design-id">#{item.id}</p>
                  <p className="size">Kích cỡ: {item.size}</p>
                  <p className="quantity">Số lượng: 1</p>
                  <p className="price">
                    {(item.price + item.customizationFee).toLocaleString()}đ
                  </p>
                </div>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveItem(item.id)}
                  title="Xóa"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right Section - Order Summary */}
        <div className="order-summary">
          <h2>Tóm tắt đơn hàng</h2>
          <div className="promo-code">
            <input
              type="text"
              placeholder="Nhập mã khuyến mãi"
              value={promoCode}
              onChange={handlePromoCodeChange}
            />
            <button onClick={handleApplyPromo}>Áp dụng</button>
          </div>

          <div className="summary-details">
            <div className="summary-row">
              <span>Tổng tiền</span>
              <span>{subtotal.toLocaleString()}đ</span>
            </div>
            <div className="summary-row">
              <span>Phí giao hàng</span>
              <span>{shippingFee.toLocaleString()}đ</span>
            </div>
            <div className="summary-row total">
              <span>Thành tiền</span>
              <span>{total.toLocaleString()}đ</span>
            </div>
          </div>

          <button
            className="checkout-button"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
