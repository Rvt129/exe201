import React from "react";

const CartActions = ({ onContinueShopping }) => {
  return (
    <div className="cart-actions">
      <button
        className="continue-shopping-btn secondary"
        onClick={onContinueShopping}
      >
        ← Tiếp tục mua sắm
      </button>
    </div>
  );
};

export default CartActions;
