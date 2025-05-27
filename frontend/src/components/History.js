import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./History.css";

function History() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError("Không thể tải lịch sử đơn hàng");
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="history-page">
      <Navbar />
      <div className="history-container">
        <h1>Lịch Sử Đơn Hàng</h1>
        {error && <div className="error-message">{error}</div>}
        <div className="orders-list">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-id">Đơn hàng #{order._id}</span>
                    <span className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <span
                    className={`order-status ${
                      order.status === "delivered" ? "delivered" : "shipping"
                    }`}
                  >
                    {order.status === "delivered"
                      ? "Đã giao hàng"
                      : "Đang giao hàng"}
                  </span>
                </div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">
                        {item.price.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <span className="order-total">
                    Tổng cộng: {order.total.toLocaleString("vi-VN")}đ
                  </span>
                  <button className="view-details-button">Xem chi tiết</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-orders">Chưa có đơn hàng nào</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;
