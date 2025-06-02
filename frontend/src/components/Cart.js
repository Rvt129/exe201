import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.items || []);
      setSubtotal(response.data.total || 0);
      setTotal((response.data.total || 0) + shippingFee);
      setError(null);
    } catch (err) {
      setError("Không thể tải giỏ hàng. Vui lòng thử lại sau.");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCart(); // Refresh cart after removal
    } catch (err) {
      setError("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
      console.error("Error removing item:", err);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/cart/${itemId}`,
        { quantity: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart(); // Refresh cart after update
    } catch (err) {
      setError("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
      console.error("Error updating quantity:", err);
    }
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

  if (loading) {
    return <div className="cart-page">Đang tải giỏ hàng...</div>;
  }

  if (error) {
    return <div className="cart-page error">{error}</div>;
  }

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
              <div key={item._id} className="cart-item">
                <div className="item-preview">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="preview-placeholder">Xem thiết kế</div>
                  )}
                </div>
                <div className="item-details">
                  <h3 className="product-name">{item.product.name}</h3>
                  <p className="product-description">
                    {item.product.description}
                  </p>
                  {item.product.size && (
                    <p className="size">Kích cỡ: {item.product.size}</p>
                  )}
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity - 1)
                      }
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity + 1)
                      }
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <p className="price">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </p>
                </div>
                <button
                  className="remove-button"
                  onClick={() => handleRemoveItem(item._id)}
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
