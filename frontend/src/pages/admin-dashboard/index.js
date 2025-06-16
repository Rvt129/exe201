import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getOrders } from "../../services/orders";
import { getRevenueStats } from "../../services/revenue";
import feedbackService from "../../services/feedback";
import "./Dashboard.css"; // Import the CSS

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalDesigns: 0,
    monthlyGrowth: 0,
    totalFeedbacks: 0,
    totalContacts: 0,
  });

  useEffect(() => {
    const loadDashboardStats = async () => {
      try {
        // Load orders count
        const ordersData = await getOrders(1, 100); // Get first 100 to count

        // Load revenue stats for growth
        const revenueData = await getRevenueStats("30days");

        // Load feedbacks count
        const feedbacksData = await feedbackService.getAllFeedbacks();

        // Load contacts count
        const contactsResponse = await fetch("/api/support/contact", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const contactsData = await contactsResponse.json();

        setStats({
          totalOrders: ordersData.totalOrders || ordersData.orders?.length || 0,
          totalDesigns: 0, // Will implement when designs API is available
          monthlyGrowth: Math.round(revenueData.monthlyGrowth || 0),
          totalFeedbacks: feedbacksData?.length || 0,
          totalContacts: contactsData?.length || 0,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    };

    loadDashboardStats();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      // Clear authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Show success message
      alert("Đăng xuất thành công!");

      // Redirect to login page
      navigate("/login");
    }
  };

  // Helper function to check if a link is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-sidebar-logo">Admin Panel</div>
          <nav>
            <ul>
              <li>
                <Link
                  to="/admin/orders"
                  className={isActive("/admin/orders") ? "active" : ""}
                >
                  <i className="fas fa-file-invoice nav-icon"></i>
                  Đơn hàng
                  <span className="nav-badge">{stats.totalOrders}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/designs"
                  className={isActive("/admin/designs") ? "active" : ""}
                >
                  <i className="fas fa-palette nav-icon"></i>
                  Thiết kế
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/revenue"
                  className={isActive("/admin/revenue") ? "active" : ""}
                >
                  <i className="fas fa-chart-line nav-icon"></i>
                  Doanh thu
                  <span className="nav-badge growth">
                    {stats.monthlyGrowth > 0 ? "+" : ""}
                    {stats.monthlyGrowth}%
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/feedback"
                  className={isActive("/admin/feedback") ? "active" : ""}
                >
                  <i className="fas fa-star nav-icon"></i>
                  Đánh giá KH
                  <span className="nav-badge">{stats.totalFeedbacks}</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/contact"
                  className={isActive("/admin/contact") ? "active" : ""}
                >
                  <i className="fas fa-envelope nav-icon"></i>
                  Liên hệ
                  <span className="nav-badge">{stats.totalContacts}</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="admin-sidebar-bottom">
          <Link to="/admin/support">
            <i className="fas fa-question-circle nav-icon"></i>
            Help and Support
          </Link>
        </div>
      </aside>
      <main className="admin-main-content">
        <header className="admin-topbar">
          <div className="admin-topbar-search">
            <input type="text" placeholder="Tìm kiếm..." />
            {/* <button style={{ marginLeft: 8}}>Lịch sử truy cập</button> */}
          </div>
          <div className="admin-topbar-actions">
            {/* Logout button */}
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Đăng xuất"
            >
              <i className="fas fa-sign-out-alt"></i>
              Đăng xuất
            </button>
          </div>
        </header>
        <div className="admin-content-area">
          <Outlet /> {/* Child routes will render here */}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

// Export child components for routing
export { default as AdminOrders } from "./orders";
export { default as AdminDesigns } from "./designs";
export { default as AdminRevenue } from "./revenue";
export { default as AdminFeedback } from "./feedback";
