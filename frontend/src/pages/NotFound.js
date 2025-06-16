import React from "react";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="notfound-title">404</div>
      <div className="notfound-subtitle">Không tìm thấy trang</div>
      <div className="notfound-desc">
        Trang bạn truy cập không tồn tại hoặc đã bị di chuyển.
      </div>
      <a href="/" className="notfound-home-link">
        Về trang chủ
      </a>
    </div>
  );
}

export default NotFound;
