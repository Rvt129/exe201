import React from "react";
import {
  FiPackage,
  FiTag,
  FiTruck,
  FiCreditCard,
  FiLock,
} from "react-icons/fi";
import { MdLocalOffer } from "react-icons/md";

const OrderSummary = ({
  cartItems,
  subtotal,
  shippingFee,
  total,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  onCheckout,
}) => {
  return (
    <div className="order-summary">
      <div className="summary-header">
        <FiPackage className="summary-icon" />
        <h2>Tóm tắt đơn hàng</h2>
      </div>

      <div className="promo-section">
        <div className="promo-input-group">
       
          <input
            type="text"
            placeholder="Nhập mã khuyến mãi"
            value={promoCode}
            onChange={onPromoCodeChange}
            className="promo-input"
          />
          <button onClick={onApplyPromo} className="apply-promo-btn">
            Áp dụng
          </button>
        </div>
      </div>

      <div className="summary-details">
        <div className="summary-row">
          <span>Tạm tính ({cartItems.length} sản phẩm)</span>
          <span>{(subtotal || 0).toLocaleString()}đ</span>
        </div>
        <div className="summary-row">
          <span>
            <FiTruck className="shipping-icon" />
            Phí vận chuyển
          </span>
          <span className="free-shipping">
            {shippingFee === 0
              ? "Miễn phí"
              : `${(shippingFee || 0).toLocaleString()}đ`}
          </span>
        </div>
        <div className="summary-divider"></div>
        <div className="summary-row total-row">
          <span>Tổng cộng</span>
          <span className="total-amount">{(total || 0).toLocaleString()}đ</span>
        </div>
      </div>

      <button
        className="checkout-button"
        onClick={onCheckout}
        disabled={cartItems.length === 0}
      >
        <FiCreditCard />
        Tiến hành thanh toán
      </button>

      <div className="security-info">
        <FiLock className="security-icon" />
        <p>Thanh toán an toàn và bảo mật</p>
      </div>
    </div>
  );
};

export default OrderSummary;
