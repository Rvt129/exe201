import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToastContext } from "../../contexts/ToastContext";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { success, error: toastError } = useToastContext();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      toastError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await fetch(
        process.env.REACT_APP_API_URL + "/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        success("Đăng ký thành công! Đang chuyển hướng...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toastError(data.message || "Đăng ký thất bại");
      }
    } catch (err) {
      toastError("Lỗi kết nối server");
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Đăng Ký</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">Họ:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Tên:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Mật khẩu:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="register-button">
            Đăng Ký
          </button>
        </form>
        <p className="login-link">
          Đã có tài khoản?{" "}
          <Link to="/login" className="link">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
