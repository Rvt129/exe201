import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders, cancelOrder } from "../../../services/orders"; // Changed getOrders to getMyOrders
import { useToastContext } from "../../../contexts/ToastContext";
import FeedbackPopup from "../../../components/feedback/FeedbackPopup";
import "./History.css";

function History() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();
  const { success, error: toastError } = useToastContext();

  const fetchOrders = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        console.log(`Fetching my orders for page ${page}...`);
        const data = await getMyOrders(page); // Use getMyOrders
        console.log(data);
        // Assuming the backend returns { orders: [], currentPage: X, totalPages: Y }
        setOrders(data.orders || []); // Ensure orders is an array
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setError("");
      } catch (err) {
        const errorMessage = "Không thể tải lịch sử đơn hàng";
        setError(errorMessage);
        toastError(errorMessage);
        console.error("Error fetching orders:", err);
        // If 401 or similar, redirect to login
        if (err.message.includes("401") || err.message.includes("token")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate, toastError]
  );

  useEffect(() => {
    fetchOrders(currentPage);
  }, [fetchOrders, currentPage]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      await cancelOrder(orderId);
      // Refresh orders list - fetch the current page again
      fetchOrders(currentPage);
      success("Đơn hàng đã được hủy thành công");
    } catch (err) {
      setError("Không thể hủy đơn hàng");
      toastError("Không thể hủy đơn hàng");
      console.error("Error cancelling order:", err);
    }
  };

  const handleViewDetails = (orderId) => {
    navigate(`/order-details/${orderId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleFeedbackClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowFeedbackPopup(true);
  };

  const handleFeedbackClose = () => {
    setShowFeedbackPopup(false);
    setSelectedOrderId(null);
  };

  const handleFeedbackSuccess = () => {
    success("Feedback đã được gửi thành công!");
    // Refresh orders to update hasFeedback status
    fetchOrders(currentPage);
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

  return (
    <div className="history-page">
      <div className="history-container">
        <h1>Lịch Sử Đơn Hàng</h1>
        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : (
          <>
            <div className="orders-list">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <span className="order-id">
                          {order.orderNumber ||
                            `Đơn hàng #${order._id.substring(0, 6)}`}
                        </span>
                        <span className="order-date">
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <span
                        className={`order-status ${getStatusClass(
                          order.fulfillment?.status
                        )}`}
                      >
                        {getStatusText(order.fulfillment?.status)}
                      </span>
                    </div>

                    <div className="order-items">
                      {order.items &&
                        order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <div className="item-info">
                              <span className="item-name">
                                {item.productName}
                              </span>
                              <div className="item-details">
                                <span className="item-size">
                                  Size: {item.size}
                                </span>
                                <span className="item-color">
                                  Màu: {item.colorName}
                                  {item.colorHex && (
                                    <span
                                      className="color-swatch"
                                      style={{ backgroundColor: item.colorHex }}
                                    ></span>
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="item-quantity-price">
                              <span className="item-quantity">
                                x{item.quantity}
                              </span>
                              <span className="item-price">
                                {(item.unitPrice || 0).toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="order-footer">
                      <div className="order-payment">
                        <span className="payment-method">
                          Thanh toán:{" "}
                          {order.payment?.method === "cod"
                            ? "Tiền mặt"
                            : order.payment?.method}
                        </span>
                        <span className="payment-status">
                          Trạng thái:{" "}
                          {order.payment?.status === "completed"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        </span>
                      </div>
                      <span className="order-total">
                        Tổng cộng:{" "}
                        {(order.pricing?.total || 0).toLocaleString("vi-VN")}đ
                      </span>
                      <div className="order-actions">
                        <button
                          className="view-details-button"
                          onClick={() => handleViewDetails(order._id)}
                        >
                          Xem chi tiết
                        </button>
                        {order.fulfillment?.status === "pending" && (
                          <button
                            className="cancel-button"
                            onClick={() => handleCancelOrder(order._id)}
                          >
                            Hủy đơn hàng
                          </button>
                        )}
                        {order.fulfillment?.status === "delivered" &&
                          !order.hasFeedback && (
                            <button
                              className="feedback-button"
                              onClick={() => handleFeedbackClick(order._id)}
                            >
                              Đánh giá
                            </button>
                          )}
                        {order.fulfillment?.status === "delivered" &&
                          order.hasFeedback && (
                            <span className="feedback-given">Đã đánh giá</span>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-orders">
                  <p>Chưa có đơn hàng nào</p>
                  <button
                    className="shop-now-button"
                    onClick={() => navigate("/")}
                  >
                    Mua sắm ngay
                  </button>
                </div>
              )}
            </div>
            {totalPages > 1 && (
              <div className="pagination-controls">
                <div className="pagination-wrapper">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i>
                    Trước
                  </button>

                  <div className="pagination-info">
                    Trang {currentPage} / {totalPages}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showFeedbackPopup && selectedOrderId && (
        <FeedbackPopup
          orderId={selectedOrderId}
          onClose={handleFeedbackClose}
          onSubmitSuccess={handleFeedbackSuccess}
        />
      )}
    </div>
  );
}

export default History;
