import React, { useState } from "react";
import "./OrderHistory.css";

// Example data
const mockOrders = [
  {
    id: 10012,
    address: "Nhà",
    status: "preparing",
    value: 103000,
    date: "2023-12-13",
  },
  {
    id: 10010,
    address: "Công ty",
    status: "shipping",
    value: 215000,
    date: "2023-12-10",
  },
  {
    id: 10009,
    address: "Nhà",
    status: "success",
    value: 99000,
    date: "2023-12-01",
  },
  {
    id: 10008,
    address: "Nhà",
    status: "cancelled",
    value: 120000,
    date: "2023-11-28",
  },
  // ...more orders
];

const statusMap = {
  preparing: { label: "Đang chuẩn bị", color: "#FF9900" },
  shipping: { label: "Đang vận chuyển", color: "#FF5722" },
  success: { label: "Thành công", color: "#00AA00" },
  cancelled: { label: "Hủy", color: "#FF3333" },
};

function OrderHistory() {
  const [orders] = useState(mockOrders);
  const [page, setPage] = useState(1);
  const rowsPerPage = 8;
  const totalPages = Math.ceil(orders.length / rowsPerPage);

  const paginatedOrders = orders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="order-history-page">
      <div className="order-history-header">
        <h2>Đơn hàng của tôi</h2>
      </div>
      <div className="order-history-table-container">
        <table className="order-history-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" disabled />
              </th>
              <th>Mã đơn</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Giá trị</th>
              <th>Ngày đặt</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <input type="checkbox" disabled />
                </td>
                <td>#{order.id}</td>
                <td>{order.address}</td>
                <td>
                  <span
                    className="order-status"
                    style={{ background: statusMap[order.status].color }}
                  >
                    {statusMap[order.status].label}
                  </span>
                </td>
                <td className="order-value">{order.value.toLocaleString()}đ</td>
                <td>{new Date(order.date).toLocaleDateString("vi-VN")}</td>
                <td>
                  <button className="order-detail-btn" title="Xem chi tiết">
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="order-history-footer">
          <span>Số dòng mỗi trang: {rowsPerPage}</span>
          <button
            className="page-nav"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Trước
          </button>
          <span>
            Trang {page} / {totalPages}
          </span>
          <button
            className="page-nav"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
