import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import "./History.css";

function History() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // In a real application, you would fetch order history from your backend
    // For now, we'll use mock data
    setOrders([
      {
        id: "12345",
        date: "15/03/2024",
        status: "Đã giao hàng",
        total: "1,500,000đ",
        items: [
          {
            name: "Áo thun cho chó",
            quantity: 2,
            price: "750,000đ",
          },
        ],
      },
      {
        id: "12344",
        date: "10/03/2024",
        status: "Đang giao hàng",
        total: "2,000,000đ",
        items: [
          {
            name: "Váy cho mèo",
            quantity: 1,
            price: "2,000,000đ",
          },
        ],
      },
    ]);
  }, []);

  return (
    <div className="history-page">
      <Navbar />
      <div className="history-container">
        <h1>Lịch Sử Đơn Hàng</h1>
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-id">Đơn hàng #{order.id}</span>
                  <span className="order-date">{order.date}</span>
                </div>
                <span
                  className={`order-status ${
                    order.status === "Đã giao hàng" ? "delivered" : "shipping"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                    <span className="item-price">{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <span className="order-total">Tổng cộng: {order.total}</span>
                <button className="view-details-button">Xem chi tiết</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;
