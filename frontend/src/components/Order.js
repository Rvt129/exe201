import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Order.css";

function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const [designData, setDesignData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: "",
    phone: "030909783",
    recipientName: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(true);

  useEffect(() => {
    // Get design data from localStorage
    const savedDesign = localStorage.getItem("design");
    if (savedDesign) {
      setDesignData(JSON.parse(savedDesign));
    }
  }, []);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement payment processing logic here
    alert("Đặt hàng thành công!");
    navigate("/");
  };

  return (
    <div className="order-page">
      <Navbar />
      <div className="order-container">
        {/* Left Section - Design Summary */}
        <div className="design-summary">
          <h2>Tóm Tắt Thiết Kế</h2>
          <div className="product-preview">
            <div className="preview-image">
              {/* Placeholder for front view */}
              <div className="preview-placeholder">Mặt Trước</div>
            </div>
            <div className="preview-image">
              {/* Placeholder for back view */}
              <div className="preview-placeholder">Mặt Sau</div>
            </div>
          </div>

          <div className="design-details">
            <p className="design-id">Thiết kế #19202</p>
            <p className="brand">Thương hiệu: Nike</p>
          </div>

          <div className="price-breakdown">
            <h3>Chi Tiết Giá</h3>
            <div className="price-item">
              <span>Giá cơ bản:</span>
              <span>3.680.000đ</span>
            </div>
            <div className="price-item">
              <span>Phí tùy chỉnh:</span>
              <span>345.000đ</span>
            </div>
            <div className="price-item">
              <span>Phí vận chuyển:</span>
              <span>230.000đ</span>
            </div>
            <div className="price-item total">
              <span>Tổng cộng:</span>
              <span>4.255.000đ</span>
            </div>
          </div>
        </div>

        {/* Right Section - Payment & Delivery */}
        <div className="payment-section">
          <div className="checkout-header">
            <h2>Thanh toán</h2>
            <p>Hoàn tất đơn hàng bằng cách cung cấp thông tin thanh toán</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="payment-methods">
              <h3>Phương Thức Thanh Toán</h3>
              <div className="payment-options">
                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "paypal" ? "selected" : ""
                  }`}
                  onClick={() => handlePaymentMethodSelect("paypal")}
                >
                  <img src="/images/paypal.png" alt="PayPal" />
                  PayPal
                </button>
                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "vnpay" ? "selected" : ""
                  }`}
                  onClick={() => handlePaymentMethodSelect("vnpay")}
                >
                  <img src="/images/vnpay.png" alt="VNPay" />
                  VNPay
                </button>
                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "cod" ? "selected" : ""
                  }`}
                  onClick={() => handlePaymentMethodSelect("cod")}
                >
                  <img src="/images/cod.png" alt="Thanh toán khi nhận hàng" />
                  Thanh toán khi nhận hàng
                </button>
              </div>
            </div>

            <div className="delivery-info">
              <h3>Thông Tin Giao Hàng</h3>
              <div className="form-group">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={deliveryInfo.address}
                  onChange={handleDeliveryInfoChange}
                  placeholder="Ví dụ: Quận 9"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={deliveryInfo.phone}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="recipientName">Tên người nhận</label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={deliveryInfo.recipientName}
                  onChange={handleDeliveryInfoChange}
                  placeholder="Ví dụ: Emma"
                  required
                />
              </div>
            </div>

            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms">
                Tôi xác nhận thông tin trên là chính xác
              </label>
            </div>

            <button
              type="submit"
              className="checkout-button"
              disabled={!paymentMethod || !termsAccepted}
            >
              Thanh toán
            </button>
            <p className="security-note">Thanh toán được bảo mật và mã hóa</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Order;
