import { getOrders, updateOrderStatus } from "../../../services/orders";
import OrderDetailsPopup from "../../../components/OrderDetailsPopup/OrderDetailsPopup";

import React, { useEffect, useState } from "react";
import "./orders.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [ordersPerPage] = useState(8); // Or get this from backend if it can vary
  // Add popup state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOrders(currentPage, ordersPerPage) // Pass current page and limit
      .then((data) => {
        setOrders(data.orders); // API now returns an object with orders array
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalOrders(data.totalOrders);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
        setOrders([]);
        setTotalPages(0);
        setTotalOrders(0);
      });
  }, [currentPage, ordersPerPage]); // Re-fetch when currentPage or ordersPerPage changes

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedOrder(null);
  };

  const handleUpdateStatus = async (
    orderId,
    newStatus,
    trackingNumber = ""
  ) => {
    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus(orderId, {
        status: newStatus,
        trackingNumber: trackingNumber || undefined,
        notes: `Status changed to ${newStatus} by admin`,
      });

      // Refresh orders list after successful update
      const data = await getOrders(currentPage, ordersPerPage);
      setOrders(data.orders);

      alert(`Đơn hàng đã được cập nhật thành "${getStatusText(newStatus)}"`);
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffa726";
      case "processing":
        return "#42a5f5";
      case "shipped":
        return "#ab47bc";
      case "delivered":
        return "#66bb6a";
      case "cancelled":
        return "#ef5350";
      default:
        return "#9e9e9e";
    }
  };

  if (loading && orders.length === 0)
    return (
      <div style={{ padding: 32, fontSize: 18, textAlign: "center" }}>
        Đang tải đơn hàng...
      </div>
    );
  if (!loading && orders.length === 0)
    return (
      <div style={{ padding: 32, fontSize: 18, textAlign: "center" }}>
        Không có đơn hàng nào.
      </div>
    );

  const formatAddress = (shippingAddress) => {
    if (!shippingAddress || !shippingAddress.city) return "Chưa có thông tin";
    return shippingAddress.city;
  };

  return (
    <div className="admin-orders-page">
      <h1 className="admin-orders-title">Quản lý đơn hàng</h1>
      <div className="admin-orders-desc">Danh sách đơn hàng của khách hàng</div>
      <div className="admin-orders-table-wrapper">
        {loading && (
          <div className="table-loading-overlay">Đang cập nhật...</div>
        )}{" "}
        {/* Optional: loading indicator over table */}
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Địa chỉ</th>
              <th>Thể loại</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="admin-orders-row" key={order._id}>
                <td>
                  {/* Prefer populated user data if available */}
                  {order.user?.firstName && order.user?.lastName
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : order.customer?.firstName && order.customer?.lastName
                    ? `${order.customer.firstName} ${order.customer.lastName}`
                    : order.shippingAddress?.name || "Chưa có thông tin"}
                  {order.user?.email && (
                    <div style={{ fontSize: "0.8em", color: "#a8a29e" }}>
                      {order.user.email}
                    </div>
                  )}
                </td>
                <td>{formatAddress(order.shippingAddress)}</td>
                <td>{order.payment?.method || "Chưa có thông tin"}</td>
                <td>
                  {order.user?.phone ||
                    order.customer?.phone ||
                    order.shippingAddress?.phone ||
                    "Chưa có thông tin"}
                </td>
                <td>
                  <span
                    className="order-status-badge"
                    style={{
                      backgroundColor: getStatusColor(
                        order.fulfillment?.status
                      ),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.8em",
                    }}
                  >
                    {getStatusText(order.fulfillment?.status)}
                  </span>
                </td>
                <td>
                  {order.metadata?.createdAt
                    ? new Date(order.metadata.createdAt).toLocaleDateString()
                    : "Chưa có thông tin"}
                </td>
                <td>
                  <div className="order-actions">
                    <button
                      className="admin-orders-btn view-btn"
                      onClick={() => handleViewOrder(order)}
                    >
                      Xem
                    </button>

                    {order.fulfillment?.status === "pending" && (
                      <button
                        className="admin-orders-btn status-btn processing"
                        onClick={() =>
                          handleUpdateStatus(order._id, "processing")
                        }
                        disabled={isUpdatingStatus}
                      >
                        Chuẩn bị
                      </button>
                    )}

                    {order.fulfillment?.status === "processing" && (
                      <button
                        className="admin-orders-btn status-btn shipped"
                        onClick={() => {
                          const trackingNumber = prompt(
                            "Nhập mã vận đơn (tùy chọn):"
                          );
                          handleUpdateStatus(
                            order._id,
                            "shipped",
                            trackingNumber
                          );
                        }}
                        disabled={isUpdatingStatus}
                      >
                        Giao hàng
                      </button>
                    )}

                    {order.fulfillment?.status === "shipped" && (
                      <button
                        className="admin-orders-btn status-btn delivered"
                        onClick={() =>
                          handleUpdateStatus(order._id, "delivered")
                        }
                        disabled={isUpdatingStatus}
                      >
                        Hoàn thành
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="pagination-btn prev-btn"
          >
            &lt;
          </button>
          <span className="pagination-info">
            Trang {currentPage} / {totalPages} (Tổng: {totalOrders} đơn hàng)
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="pagination-btn next-btn"
          >
            &gt;
          </button>
        </div>
      )}
      {/* Add OrderDetailsPopup */}
      <OrderDetailsPopup
        order={selectedOrder}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default AdminOrders;
