import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import {
  FaUserCircle,
  FaTshirt,
  FaHistory,
  FaHome,
  FaChevronRight,
} from "react-icons/fa";
import "./Dashboard.css";

const menu = [
  {
    label: "Hồ sơ cá nhân",
    path: "my-profile",
    icon: <FaUserCircle />,
    description: "Quản lý thông tin tài khoản",
  },
  {
    label: "Thiết kế của tôi",
    path: "my-designs",
    icon: <FaTshirt />,
    description: "Xem và quản lý thiết kế",
  },
  {
    label: "Lịch sử đơn hàng",
    path: "my-orders-history",
    icon: <FaHistory />,
    description: "Theo dõi đơn hàng",
  },
];

export default function CustomerDashboard() {
  const location = useLocation();

  const getCurrentPageInfo = () => {
    const currentPath = location.pathname.split("/").pop();
    const currentMenu = menu.find((item) => item.path === currentPath);
    return (
      currentMenu || { label: "Dashboard", description: "Trang chủ khách hàng" }
    );
  };

  const currentPage = getCurrentPageInfo();

  return (
    <div className="dashboard-root">
      <Navbar />
      <div className="dashboard-padding" />
      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <div className="dashboard-sidebar-header">
            <h2 className="dashboard-sidebar-title">
              <FaHome />
              Dashboard
            </h2>
            <p className="dashboard-sidebar-subtitle">
              Quản lý tài khoản và đơn hàng của bạn
            </p>
          </div>
          <nav className="dashboard-nav">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  "dashboard-link" + (isActive ? " active" : "")
                }
              >
                <span className="dashboard-link-icon">{item.icon}</span>
                <div className="dashboard-link-content">
                  <span className="dashboard-link-label">{item.label}</span>
                </div>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-main-header">
            <div className="dashboard-breadcrumb">
              <span>Dashboard</span>
              <FaChevronRight className="breadcrumb-separator" />
              <span>{currentPage.label}</span>
            </div>
            <h1 className="dashboard-main-title">
              {currentPage.icon}
              {currentPage.label}
            </h1>
            <p className="dashboard-main-subtitle">{currentPage.description}</p>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
