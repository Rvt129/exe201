import React from "react";
import { FiShoppingBag, FiShoppingCart } from "react-icons/fi";

const EmptyCart = ({ onContinueShopping }) => {
  return (
    <div className="empty-cart">
      <div className="empty-icon">
        <FiShoppingBag />
      </div>
      <h3>Giỏ hàng của bạn đang trống</h3>
      <p>Hãy khám phá những sản phẩm tuyệt vời dành cho thú cưng!</p>
      <button className="continue-shopping-btn" onClick={onContinueShopping}>
        <FiShoppingCart />
        Tiếp tục mua sắm
      </button>
    </div>
  );
};

export default EmptyCart;
