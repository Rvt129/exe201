import React from "react";
import "./OrderDetailsPopup.css";

const OrderDetailsPopup = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;
  console.log(order)

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status-pending";
      case "processing":
        return "status-processing";
      case "shipped":
        return "status-shipped";
      case "delivered":
      case "completed":
        return "status-completed";
      case "cancelled":
        return "status-cancelled";
      default:
        return "status-other";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đã gửi hàng";
      case "delivered":
        return "Đã giao hàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status || "Không rõ";
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Chờ thanh toán";
      case "completed":
        return "Đã thanh toán";
      case "failed":
        return "Thanh toán thất bại";
      default:
        return status || "Không rõ";
    }
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>Chi tiết đơn hàng</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="popup-body">
          {/* Order Basic Info */}
          <div className="info-section">
            <h3>Thông tin đơn hàng</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Mã đơn hàng:</label>
                <span>{order.orderNumber || order._id}</span>
              </div>
              <div className="info-item">
                <label>Ngày đặt:</label>
                <span>
                  {formatDate(order.metadata?.createdAt || order.createdAt)}
                </span>
              </div>
              <div className="info-item">
                <label>Trạng thái đơn hàng:</label>
                <span className={getStatusClass(order.fulfillment?.status)}>
                  {getStatusText(order.fulfillment?.status)}
                </span>
              </div>
              <div className="info-item">
                <label>Trạng thái thanh toán:</label>
                <span className={getStatusClass(order.payment?.status)}>
                  {getPaymentStatusText(order.payment?.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="info-section">
            <h3>Thông tin khách hàng</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Tên khách hàng:</label>
                <span>
                  {order.user?.firstName && order.user?.lastName
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : order.customer?.firstName && order.customer?.lastName
                    ? `${order.customer.firstName} ${order.customer.lastName}`
                    : order.shippingAddress?.name || "Chưa có thông tin"}
                </span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>
                  {order.user?.email ||
                    order.customer?.email ||
                    "Chưa có thông tin"}
                </span>
              </div>
              <div className="info-item">
                <label>Số điện thoại:</label>
                <span>
                  {order.user?.phone ||
                    order.customer?.phone ||
                    order.shippingAddress?.phone ||
                    "Chưa có thông tin"}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="info-section">
            <h3>Địa chỉ giao hàng</h3>
            <div className="address-info">
              {order.shippingAddress ? (
                <>
                  <p>
                    <strong>Người nhận:</strong>{" "}
                    {order.shippingAddress.name || "Chưa có thông tin"}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong>{" "}
                    {order.shippingAddress.phone || "Chưa có thông tin"}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong>
                  </p>
                  <p>
                    {[
                      order.shippingAddress.street,
                      order.shippingAddress.ward,
                      order.shippingAddress.district,
                      order.shippingAddress.city,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Chưa có thông tin"}
                  </p>
                </>
              ) : (
                <p>Chưa có thông tin địa chỉ giao hàng</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="info-section">
            <h3>Sản phẩm đặt hàng</h3>
            <div className="items-list">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="item-card">
                    <div className="item-image">
                      {item.designSnapshot?.previewImage ? (
                        <img
                          src={"http://localhost:5000" + item.designSnapshot.previewImage}
                          alt={item.productName}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="no-image">Không có hình ảnh</div>
                      )}
                    </div>
                    <div className="item-details">
                      <h4>{item.productName || "Sản phẩm không tên"}</h4>
                      <p>
                        <strong>Màu sắc:</strong> {item.colorName || "Không rõ"}
                      </p>
                      <p>
                        <strong>Size:</strong> {item.size || "Không rõ"}
                      </p>
                      <p>
                        <strong>Số lượng:</strong> {item.quantity || 1}
                      </p>
                      <p>
                        <strong>Đơn giá:</strong>{" "}
                        {formatCurrency(item.unitPrice)}
                      </p>
                      <p>
                        <strong>Thành tiền:</strong>{" "}
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có sản phẩm nào trong đơn hàng</p>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="info-section">
            <h3>Thông tin thanh toán</h3>
            <div className="pricing-info">
              <div className="pricing-row">
                <span>Tạm tính:</span>
                <span>{formatCurrency(order.pricing?.subtotal)}</span>
              </div>
              <div className="pricing-row">
                <span>Phí vận chuyển:</span>
                <span>{formatCurrency(order.pricing?.shippingFee)}</span>
              </div>
              {order.pricing?.tax > 0 && (
                <div className="pricing-row">
                  <span>Thuế:</span>
                  <span>{formatCurrency(order.pricing.tax)}</span>
                </div>
              )}
              {order.pricing?.discount > 0 && (
                <div className="pricing-row discount">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(order.pricing.discount)}</span>
                </div>
              )}
              <div className="pricing-row total">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(order.pricing?.total)}</span>
              </div>
              <div className="payment-method">
                <span>Phương thức thanh toán:</span>
                <span>{order.payment?.method || "Chưa có thông tin"}</span>
              </div>
              {order.payment?.transactionId && (
                <div className="transaction-id">
                  <span>Mã giao dịch:</span>
                  <span>{order.payment.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Fulfillment Info */}
          {(order.fulfillment?.trackingNumber || order.fulfillment?.notes) && (
            <div className="info-section">
              <h3>Thông tin vận chuyển</h3>
              <div className="fulfillment-info">
                {order.fulfillment.trackingNumber && (
                  <p>
                    <strong>Mã vận đơn:</strong>{" "}
                    {order.fulfillment.trackingNumber}
                  </p>
                )}
                {order.fulfillment.shippedAt && (
                  <p>
                    <strong>Ngày gửi hàng:</strong>{" "}
                    {formatDate(order.fulfillment.shippedAt)}
                  </p>
                )}
                {order.fulfillment.deliveredAt && (
                  <p>
                    <strong>Ngày giao hàng:</strong>{" "}
                    {formatDate(order.fulfillment.deliveredAt)}
                  </p>
                )}
                {order.fulfillment.notes && (
                  <p>
                    <strong>Ghi chú:</strong> {order.fulfillment.notes}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPopup;
