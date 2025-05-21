import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    // In a real application, you would fetch user data from your backend
    // For now, we'll use mock data
    setUserInfo({
      email: "user@example.com",
      name: "Nguyễn Văn A",
      phone: "030909783",
      address: "Quận 9, TP.HCM",
      joinDate: "01/01/2024",
    });
  }, []);

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>Tài Khoản Của Tôi</h1>
        </div>

        <div className="profile-content">
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
                <span>{userInfo.phone}</span>
              </div>
              <div className="info-item">
                <label>Địa chỉ:</label>
                <span>{userInfo.address}</span>
              </div>
              <div className="info-item">
                <label>Ngày tham gia:</label>
                <span>{userInfo.joinDate}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h2>Hoạt Động Gần Đây</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-date">15/03/2024</span>
                <span className="activity-text">
                  Đặt hàng thành công #12345
                </span>
              </div>
              <div className="activity-item">
                <span className="activity-date">10/03/2024</span>
                <span className="activity-text">Tạo thiết kế mới</span>
              </div>
              <div className="activity-item">
                <span className="activity-date">05/03/2024</span>
                <span className="activity-text">
                  Cập nhật thông tin cá nhân
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
