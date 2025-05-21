import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
    alert("Order submitted successfully!");
    navigate("/");
  };

  return (
    <div className="order-page">
      <div className="order-container">
        {/* Left Section - Design Summary */}
        <div className="design-summary">
          <h2>Design Summary</h2>
          <div className="product-preview">
            <div className="preview-image">
              {/* Placeholder for front view */}
              <div className="preview-placeholder">Front View</div>
            </div>
            <div className="preview-image">
              {/* Placeholder for back view */}
              <div className="preview-placeholder">Back View</div>
            </div>
          </div>

          <div className="design-details">
            <p className="design-id">Design #19202</p>
            <p className="brand">Brand: Nike</p>
          </div>

          <div className="price-breakdown">
            <h3>Price Breakdown</h3>
            <div className="price-item">
              <span>Base Price:</span>
              <span>$160.00</span>
            </div>
            <div className="price-item">
              <span>Customization Fee:</span>
              <span>$15.00</span>
            </div>
            <div className="price-item">
              <span>Shipping Fee:</span>
              <span>$10.00</span>
            </div>
            <div className="price-item total">
              <span>Total Amount:</span>
              <span>$185.00</span>
            </div>
          </div>
        </div>

        {/* Right Section - Payment & Delivery */}
        <div className="payment-section">
          <div className="checkout-header">
            <h2>Thanh toán</h2>
            <p>
              Complete your purchase by providing us with your payment details
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="payment-methods">
              <h3>Payment Methods</h3>
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
                  <img src="/images/cod.png" alt="Cash on Delivery" />
                  Cash on Delivery
                </button>
              </div>
            </div>

            <div className="delivery-info">
              <h3>Delivery Information</h3>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={deliveryInfo.address}
                  onChange={handleDeliveryInfoChange}
                  placeholder="e.g., District 9"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={deliveryInfo.phone}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="recipientName">Recipient Name</label>
                <input
                  type="text"
                  id="recipientName"
                  name="recipientName"
                  value={deliveryInfo.recipientName}
                  onChange={handleDeliveryInfoChange}
                  placeholder="e.g., Emma"
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
                I confirm the information above is correct
              </label>
            </div>

            <button
              type="submit"
              className="checkout-button"
              disabled={!paymentMethod || !termsAccepted}
            >
              Thanh toán
            </button>
            <p className="security-note">Payments are secured and encrypted</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Order;
