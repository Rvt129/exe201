import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showDesignDropdown, setShowDesignDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showIntroDropdown, setShowIntroDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleProfileClick = () => {
    setShowUserDropdown(false);
    navigate("/profile");
  };

  const handleHistoryClick = () => {
    setShowUserDropdown(false);
    navigate("/history");
  };

  return (
    <>
      <div className="tagline-bar">
        <p>
          Stick to what works. Functional and good-looking designs for your pet.
        </p>
      </div>
      <nav className="navbar">
        <div className="navbar-left">
          <div className="dropdown">
            <button
              className="dropdown-button"
              onMouseEnter={() => setShowDesignDropdown(true)}
              onMouseLeave={() => setShowDesignDropdown(false)}
            >
              TẤT CẢ THIẾT KẾ
            </button>
            {showDesignDropdown && (
              <div className="dropdown-content">
                <Link to="/designs/dogs">Thiết kế cho chó</Link>
                <Link to="/designs/cats">Thiết kế cho mèo</Link>
                <Link to="/designs/new">Thiết kế mới</Link>
                <Link to="/designs/popular">Thiết kế phổ biến</Link>
              </div>
            )}
          </div>

          <div className="dropdown">
            <button
              className="dropdown-button"
              onMouseEnter={() => setShowServiceDropdown(true)}
              onMouseLeave={() => setShowServiceDropdown(false)}
            >
              DỊCH VỤ
            </button>
            {showServiceDropdown && (
              <div className="dropdown-content">
                <Link to="/services/custom">May đo tùy chỉnh</Link>
                <Link to="/services/repair">Sửa chữa</Link>
                <Link to="/services/consultation">Tư vấn</Link>
              </div>
            )}
          </div>
        </div>

        <div className="navbar-center">
          <Link to="/" className="logo">
            YOUR PAWPAL
          </Link>
        </div>

        <div className="navbar-right">
          <div className="dropdown">
            <button
              className="dropdown-button"
              onMouseEnter={() => setShowIntroDropdown(true)}
              onMouseLeave={() => setShowIntroDropdown(false)}
            >
              GIỚI THIỆU
            </button>
            {showIntroDropdown && (
              <div className="dropdown-content">
                <Link to="/about">Về chúng tôi</Link>
                <Link to="/contact">Liên hệ</Link>
                <Link to="/faq">FAQ</Link>
              </div>
            )}
          </div>

          <button
            className="icon-button"
            onClick={() => setShowSearch(!showSearch)}
          >
            🔍
          </button>

          <Link to="/cart" className="icon-button">
            🛒
          </Link>

          {isLoggedIn ? (
            <div className="user-dropdown">
              <button
                className="avatar-button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                👤
              </button>
              {showUserDropdown && (
                <div className="dropdown-content">
                  <button
                    onClick={handleProfileClick}
                    className="dropdown-link"
                  >
                    <span className="dropdown-icon">👤</span>
                    Tài khoản
                  </button>
                  <button
                    onClick={handleHistoryClick}
                    className="dropdown-link"
                  >
                    <span className="dropdown-icon">📦</span>
                    Đơn hàng của tôi
                  </button>
                  <Link to="/designs/my" className="dropdown-link">
                    <span className="dropdown-icon">🎨</span>
                    Thiết kế của tôi
                  </Link>
                  <Link to="/settings" className="dropdown-link">
                    <span className="dropdown-icon">⚙️</span>
                    Cài đặt
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="dropdown-link logout"
                  >
                    <span className="dropdown-icon">🚪</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-button">
                Đăng nhập
              </Link>
              <Link to="/register" className="auth-button">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </nav>
      {showSearch && (
        <div className="search-overlay">
          <input
            type="text"
            placeholder="Tìm kiếm thiết kế, dịch vụ..."
            className="search-input"
          />
          <button onClick={() => setShowSearch(false)}>✕</button>
        </div>
      )}
    </>
  );
}

export default Navbar;
