import React from "react";
import { FiShoppingCart, FiPackage } from "react-icons/fi";

const CartHeader = ({ itemCount }) => {
  return (
    <div className="cart-header">
      <div className="cart-title-section">
        <FiShoppingCart className="cart-icon" />
        <h1 className="cart-title">Giỏ hàng của bạn</h1>
      </div>
      <div className="cart-subtitle">
        <FiPackage className="subtitle-icon" />
        <span>{itemCount} sản phẩm đang chờ thanh toán</span>
      </div>
    </div>
  );
};

export default CartHeader;
