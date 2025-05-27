import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Profile.css";

function Profile() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    joinDate: "",
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const data = await response.json();
        setUserInfo({
          email: data.email,
          name: data.name,
          phone: data.phone || "",
          address: data.address || "",
          joinDate: new Date(data.createdAt).toLocaleDateString("vi-VN") || "",
        });
      } catch (err) {
        setError("Không thể tải thông tin người dùng");
        console.error("Error fetching profile:", err);
      }
    };

    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/orders/recent",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch recent orders");
        }

        const data = await response.json();
        setRecentOrders(data);
      } catch (err) {
        console.error("Error fetching recent orders:", err);
      }
    };

    fetchUserProfile();
    fetchRecentOrders();
  }, [navigate]);

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Tài Khoản Của Tôi</h1>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="profile-section">
          <h2>Thông Tin Cá Nhân</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Email:</label>
              <span>{userInfo.email}</span>
            </div>
            <div className="info-item">
              <label>Họ và tên:</label>
              <span>{userInfo.name}</span>
            </div>
            <div className="info-item">
              <label>Số điện thoại:</label>
              <span>{userInfo.phone || "Chưa cập nhật"}</span>
            </div>
            <div className="info-item">
              <label>Địa chỉ:</label>
              <span>{userInfo.address || "Chưa cập nhật"}</span>
            </div>
            <div className="info-item">
              <label>Ngày tham gia:</label>
              <span>{userInfo.joinDate || "Chưa cập nhật"}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Hoạt Động Gần Đây</h2>
          <div className="activity-list">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="activity-item">
                  <span className="activity-date">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <span className="activity-text">
                    Đặt hàng thành công #{order._id}
                  </span>
                </div>
              ))
            ) : (
              <div className="no-activity">Chưa có hoạt động nào</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
