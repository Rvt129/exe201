import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { getOrderById, cancelOrder } from "../../services/orders";
import { useToastContext } from "../../contexts/ToastContext";
import "./OrderDetails.css";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { success, error: toastError } = useToastContext();

  const fetchOrderDetails = useCallback(async () => {
    try {
      setLoading(true);
      const orderData = await getOrderById(id);
      setOrder(orderData);
      setError("");
    } catch (err) {
      setError("Không thể tải thông tin đơn hàng");
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      await cancelOrder(id);
      fetchOrderDetails(); // Refresh order details
      success("Đơn hàng đã được hủy thành công");
    } catch (err) {
      setError("Không thể hủy đơn hàng");
      toastError("Không thể hủy đơn hàng");
      console.error("Error cancelling order:", err);
    }
  };

  // Function to get status text in Vietnamese
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Đang xử lý";
      case "processing":
        return "Đang chuẩn bị";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  // Function to get status class for styling
  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "pending";
      case "processing":
        return "processing";
      case "shipped":
        return "shipping";
      case "delivered":
        return "delivered";
      case "cancelled":
        return "cancelled";
      default:
        return "";
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="order-details-page">
      <Navbar />
      <div className="order-details-container">
        <div className="details-header">
          <button
            className="back-button"
            onClick={() => navigate("/dashboard/my-orders-history")}
          >
            ← Quay lại
          </button>
          <h1>Chi Tiết Đơn Hàng</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : order ? (
          <div className="order-details-content">
            <div className="order-details-card">
              <div className="order-meta">
                <div className="order-number">
                  {order.orderNumber ||
                    `Đơn hàng #${order._id.substring(0, 6)}`}
                </div>
                <div
                  className={`order-status ${getStatusClass(
                    order.fulfillment?.status
                  )}`}
                >
                  {getStatusText(order.fulfillment?.status)}
                </div>
              </div>

              <div className="order-dates">
                <div className="date-item">
                  <span className="date-label">Ngày đặt hàng:</span>
                  <span className="date-value">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                {order.payment?.paidAt && (
                  <div className="date-item">
                    <span className="date-label">Ngày thanh toán:</span>
                    <span className="date-value">
                      {formatDate(order.payment.paidAt)}
                    </span>
                  </div>
                )}
                {order.fulfillment?.shippedAt && (
                  <div className="date-item">
                    <span className="date-label">Ngày giao hàng:</span>
                    <span className="date-value">
                      {formatDate(order.fulfillment.shippedAt)}
                    </span>
                  </div>
                )}
                {order.fulfillment?.deliveredAt && (
                  <div className="date-item">
                    <span className="date-label">Ngày nhận hàng:</span>
                    <span className="date-value">
                      {formatDate(order.fulfillment.deliveredAt)}
                    </span>
                  </div>
                )}
              </div>

              {order.fulfillment?.trackingNumber && (
                <div className="tracking-info">
                  <span className="tracking-label">Mã vận đơn:</span>
                  <span className="tracking-number">
                    {order.fulfillment.trackingNumber}
                  </span>
                </div>
              )}

              {order.fulfillment?.status === "pending" && (
                <div className="order-actions">
                  <button className="cancel-button" onClick={handleCancelOrder}>
                    Hủy đơn hàng
                  </button>
                </div>
              )}
            </div>

            <div className="order-section">
              <h2>Sản Phẩm</h2>
              <div className="order-items-details">
                {order.items &&
                  order.items.map((item, index) => (
                    <div key={index} className="order-item-detail">
                      {item.designSnapshot?.previewImage && (
                        <div className="item-image">
                          <img
                            src={
                              "http://localhost:5000" +
                              item.designSnapshot.previewImage
                            }
                            alt={item.productName}
                          />
                        </div>
                      )}
                      <div className="item-content">
                        <div className="item-header">
                          <h3 className="item-title">{item.productName}</h3>
                          <span className="item-price">
                            {(item.unitPrice || 0).toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                        <div className="item-specs">
                          <span className="item-spec">Size: {item.size}</span>
                          <span className="item-spec">
                            Màu: {item.colorName}
                            {item.colorHex && (
                              <span
                                className="color-swatch"
                                style={{ backgroundColor: item.colorHex }}
                              ></span>
                            )}
                          </span>
                          <span className="item-spec">
                            Số lượng: {item.quantity}
                          </span>
                        </div>
                        <div className="item-subtotal">
                          <span>
                            Thành tiền:{" "}
                            {(item.totalPrice || 0).toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="order-sections-grid">
              <div className="order-section">
                <h2>Thông Tin Thanh Toán</h2>
                <div className="payment-info">
                  <div className="info-row">
                    <span className="info-label">Phương thức:</span>
                    <span className="info-value">
                      {order.payment?.method === "cod"
                        ? "Tiền mặt khi nhận hàng"
                        : order.payment?.method === "vnpay"
                        ? "VNPay"
                        : order.payment?.method === "paypal"
                        ? "PayPal"
                        : order.payment?.method || "N/A"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Trạng thái:</span>
                    <span
                      className={`info-value payment-status-${order.payment?.status}`}
                    >
                      {order.payment?.status === "completed"
                        ? "Đã thanh toán"
                        : order.payment?.status === "pending"
                        ? "Chưa thanh toán"
                        : order.payment?.status === "failed"
                        ? "Thanh toán thất bại"
                        : "N/A"}
                    </span>
                  </div>
                  {order.payment?.transactionId && (
                    <div className="info-row">
                      <span className="info-label">Mã giao dịch:</span>
                      <span className="info-value">
                        {order.payment.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-section">
                <h2>Thông Tin Giao Hàng</h2>
                <div className="shipping-info">
                  <div className="info-row">
                    <span className="info-label">Người nhận:</span>
                    <span className="info-value">
                      {order.shippingAddress?.name || "N/A"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Số điện thoại:</span>
                    <span className="info-value">
                      {order.shippingAddress?.phone || "N/A"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Địa chỉ:</span>
                    <span className="info-value">
                      {order.shippingAddress
                        ? `${order.shippingAddress.street}, ${order.shippingAddress.ward}, ${order.shippingAddress.district}, ${order.shippingAddress.city}`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-section">
              <h2>Tổng Kết Đơn Hàng</h2>
              <div className="order-summary">
                <div className="summary-row">
                  <span className="summary-label">Tổng tiền hàng:</span>
                  <span className="summary-value">
                    {(order.pricing?.subtotal || 0).toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Phí vận chuyển:</span>
                  <span className="summary-value">
                    {(order.pricing?.shippingFee || 0).toLocaleString("vi-VN")}đ
                  </span>
                </div>
                {order.pricing?.tax > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">Thuế:</span>
                    <span className="summary-value">
                      {order.pricing.tax.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
                {order.pricing?.discount > 0 && (
                  <div className="summary-row discount">
                    <span className="summary-label">Giảm giá:</span>
                    <span className="summary-value">
                      -{order.pricing.discount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
                <div className="summary-row total">
                  <span className="summary-label">Tổng thanh toán:</span>
                  <span className="summary-value">
                    {(order.pricing?.total || 0).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            </div>

            {order.fulfillment?.notes && (
              <div className="order-section">
                <h2>Ghi Chú</h2>
                <div className="order-notes">{order.fulfillment.notes}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="not-found">
            <p>Không tìm thấy thông tin đơn hàng</p>
            <button
              className="back-to-history-button"
              onClick={() => navigate("/history")}
            >
              Quay lại lịch sử đơn hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
