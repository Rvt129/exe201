import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToastContext } from "../../contexts/ToastContext";
import { saveUserSession, navigateByRole } from "../../utils/auth";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { success, error: toastError } = useToastContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save user session data
        saveUserSession(data);

        success("Đăng nhập thành công!");

        // Lấy redirect path từ query string (nếu có)
        const params = new URLSearchParams(location.search);
        const redirectPath = params.get("redirect");

        setTimeout(() => {
          if (redirectPath) {
            navigate(redirectPath, { replace: true });
          } else {
            navigateByRole(data.role, navigate);
          }
        }, 1500);
      } else {
        toastError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      toastError("Lỗi kết nối server");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Đăng Nhập</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Đăng Nhập
          </button>
        </form>
        <p className="register-link">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="link">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
