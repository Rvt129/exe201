import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const QuantityControl = ({ itemId, quantity, onUpdateQuantity }) => {
  return (
    <div className="quantity-control">
      <button
        onClick={() => onUpdateQuantity(itemId, quantity - 1)}
        className="quantity-btn minus"
        disabled={quantity <= 1}
      >
        <FiMinus />
      </button>
      <span className="quantity">{quantity}</span>
      <button
        onClick={() => onUpdateQuantity(itemId, quantity + 1)}
        className="quantity-btn plus"
      >
        <FiPlus />
      </button>
    </div>
  );
};

export default QuantityControl;
