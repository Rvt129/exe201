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

  // Add timers for dropdown delays
  const [designTimer, setDesignTimer] = useState(null);
  const [serviceTimer, setServiceTimer] = useState(null);
  const [introTimer, setIntroTimer] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (designTimer) clearTimeout(designTimer);
      if (serviceTimer) clearTimeout(serviceTimer);
      if (introTimer) clearTimeout(introTimer);
    };
  }, [designTimer, serviceTimer, introTimer]);

  const handleDropdownEnter = (dropdown) => {
    switch (dropdown) {
      case "design":
        if (designTimer) clearTimeout(designTimer);
        setShowDesignDropdown(true);
        break;
      case "service":
        if (serviceTimer) clearTimeout(serviceTimer);
        setShowServiceDropdown(true);
        break;
      case "intro":
        if (introTimer) clearTimeout(introTimer);
        setShowIntroDropdown(true);
        break;
      default:
        break;
    }
  };

  const handleDropdownLeave = (dropdown) => {
    switch (dropdown) {
      case "design":
        const dTimer = setTimeout(() => setShowDesignDropdown(false), 300);
        setDesignTimer(dTimer);
        break;
      case "service":
        const sTimer = setTimeout(() => setShowServiceDropdown(false), 300);
        setServiceTimer(sTimer);
        break;
      case "intro":
        const iTimer = setTimeout(() => setShowIntroDropdown(false), 300);
        setIntroTimer(iTimer);
        break;
      default:
        break;
    }
  };

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
          🎨 Thiết kế độc đáo cho thú cưng của bạn - In chất lượng cao, giao
          hàng tận nơi! 🐕🐱
        </p>
      </div>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/products" className="nav-link">
            SẢN PHẨM
          </Link>

          <div className="dropdown">
            <button
              className="dropdown-button"
              onMouseEnter={() => handleDropdownEnter("design")}
              onMouseLeave={() => handleDropdownLeave("design")}
            >
              THIẾT KẾ
            </button>
            {showDesignDropdown && (
              <div
                className="dropdown-content"
                onMouseEnter={() => handleDropdownEnter("design")}
                onMouseLeave={() => handleDropdownLeave("design")}
              >
                <Link to="/design" className="featured-link">
                  🎨 Tạo thiết kế mới
                </Link>
                <div className="dropdown-divider"></div>
                <Link to="/designs/gallery">Thư viện thiết kế</Link>
                <Link to="/designs/popular">Thiết kế phổ biến</Link>
                <Link to="/designs/trending">Xu hướng</Link>
              </div>
            )}
          </div>

          <div className="dropdown">
            <button
              className="dropdown-button"
              onMouseEnter={() => handleDropdownEnter("service")}
              onMouseLeave={() => handleDropdownLeave("service")}
            >
              DỊCH VỤ
            </button>
            {showServiceDropdown && (
              <div
                className="dropdown-content"
                onMouseEnter={() => handleDropdownEnter("service")}
                onMouseLeave={() => handleDropdownLeave("service")}
              >
                <Link to="/services/custom-printing">In ấn theo yêu cầu</Link>
                <Link to="/services/sizing-guide">Hướng dẫn chọn size</Link>
                <Link to="/services/design-consultation">Tư vấn thiết kế</Link>
                <Link to="/services/bulk-orders">Đặt hàng số lượng lớn</Link>
              </div>
            )}
          </div>
        </div>

        <div className="navbar-center">
          <Link to="/" className="logo">
            🐾 MY PAWPAL 
          </Link>
          <p className="logo-tagline">Custom Pet Apparel</p>
        </div>

        <div className="navbar-right">
          <div className="dropdown">
            <button
              className="dropdown-button"
              onMouseEnter={() => handleDropdownEnter("intro")}
              onMouseLeave={() => handleDropdownLeave("intro")}
            >
              HỖ TRỢ
            </button>
            {showIntroDropdown && (
              <div
                className="dropdown-content"
                onMouseEnter={() => handleDropdownEnter("intro")}
                onMouseLeave={() => handleDropdownLeave("intro")}
              >
                <Link to="/support" className="featured-link">
                  🎧 Trung tâm hỗ trợ
                </Link>
                <div className="dropdown-divider"></div>
                <Link to="/how-it-works">Cách thức hoạt động</Link>
                <Link to="/size-guide">Bảng size</Link>
                <Link to="/material-info">Chất liệu & In ấn</Link>
                <Link to="/shipping">Vận chuyển</Link>
                <Link to="/faq">Câu hỏi thường gặp</Link>
                <Link to="/contact">Liên hệ</Link>
              </div>
            )}
          </div>

          <button
            className="icon-button search-btn"
            onClick={() => setShowSearch(!showSearch)}
            title="Tìm kiếm"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <Link to="/cart" className="cart-button" title="Giỏ hàng">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V19C17 20.1 17.9 21 19 21S21 20.1 21 19V13M9 19.5C9.8 19.5 10.5 20.2 10.5 21S9.8 22.5 9 22.5 7.5 21.8 7.5 21 8.2 19.5 9 19.5ZM20 19.5C20.8 19.5 21.5 20.2 21.5 21S20.8 22.5 20 22.5 18.5 21.8 18.5 21 19.2 19.5 20 19.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Cart counter can be added here */}
          </Link>

          {isLoggedIn ? (
            <div className="user-dropdown">
              <button
                className="avatar-button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                title="Tài khoản"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {showUserDropdown && (
                <div className="dropdown-content user-menu">
                  <Link to="/dashboard/my-profile" className="dropdown-link">
                    Hồ sơ của tôi
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="dropdown-link logout"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-button login-btn">
                Đăng nhập
              </Link>
              <Link to="/register" className="auth-button register-btn">
                Đăng ký
              </Link>
            </div>
          )}

          {/* Quick Design CTA for non-logged users */}
          {!isLoggedIn && (
            <Link to="/design-studio" className="cta-button">
              Thiết kế ngay
            </Link>
          )}
        </div>
      </nav>
      {showSearch && (
        <div className="search-overlay">
          <div className="search-container">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, thiết kế, mẫu áo thú cưng..."
              className="search-input"
              autoFocus
            />
            <button className="search-button">🔍</button>
            <button
              className="search-close"
              onClick={() => setShowSearch(false)}
            >
              ✕
            </button>
          </div>
          <div className="search-suggestions">
            <p>Gợi ý tìm kiếm:</p>
            <div className="suggestion-tags">
              <span className="tag">Áo cho chó</span>
              <span className="tag">Thiết kế mèo</span>
              <span className="tag">In tên thú cưng</span>
              <span className="tag">Size XL</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
