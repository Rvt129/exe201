import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentError.css";

function PaymentError() {
  const navigate = useNavigate();

  return (
    <div className="payment-error-page">
      <div className="payment-error-card">
        <div className="payment-error-icon">❌</div>
        <h2 className="payment-error-title">Giao dịch thất bại</h2>
        <p className="payment-error-desc">
          Đã có lỗi xảy ra hoặc bạn đã hủy thanh toán.
          <br />
          Vui lòng thử lại hoặc liên hệ hỗ trợ nếu cần thiết.
        </p>
        <button
          className="payment-error-btn-main"
          onClick={() => navigate("/my-orders-history")}
        >
          Quay lại lịch sử đơn hàng
        </button>
        <br />
        <button
          className="payment-error-btn-secondary"
          onClick={() => navigate("/")}
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
export default PaymentError;
