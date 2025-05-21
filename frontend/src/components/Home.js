import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <Navbar />
      <main className="home-main">
        <div className="hero-section">
          <h2>Thiết Kế Phong Cách Cho Thú Cưng</h2>
          <p>Tạo trang phục tùy chỉnh cho người bạn lông xù của bạn</p>
          <Link to="/design" className="cta-button">
            Bắt Đầu Thiết Kế
          </Link>
        </div>

        <div className="features-section">
          <div className="feature-card">
            <h3>Thiết Kế Tùy Chỉnh</h3>
            <p>Tạo thiết kế trang phục độc đáo cho thú cưng của bạn</p>
          </div>
          <div className="feature-card">
            <h3>Chất Liệu Cao Cấp</h3>
            <p>Vải cao cấp cho sự thoải mái và độ bền</p>
          </div>
          <div className="feature-card">
            <h3>Vừa Vặn Hoàn Hảo</h3>
            <p>Nhiều kích cỡ cho tất cả các giống thú cưng</p>
          </div>
        </div>
      </main>

      <footer className="home-footer">
        <p>&copy; 2024 Cửa Hàng Thời Trang Thú Cưng. Bảo lưu mọi quyền.</p>
      </footer>
    </div>
  );
}

export default Home;
