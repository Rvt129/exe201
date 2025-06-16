import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PayOS() {
  const location = useLocation();
  const navigate = useNavigate();
  const payUrl = location.state?.payUrl;
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (payUrl && orderId) {
      window.open(payUrl, "_blank");
      // Sau khi mở tab thanh toán, chuyển về trang chi tiết đơn hàng
      navigate(`/order/${orderId}`);
    } else {
      // Nếu thiếu payUrl hoặc orderId (reload hoặc truy cập trực tiếp), chuyển về trang báo lỗi giao dịch
      navigate("/payment-error");
    }
  }, [payUrl, orderId, navigate]);

  return null;
}

export default PayOS;
