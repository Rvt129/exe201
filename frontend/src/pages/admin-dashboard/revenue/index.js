import React, { useEffect, useState } from "react";
import { getRevenueStats } from "../../../services/revenue";
import "./revenue.css";

const AdminRevenue = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    dailyRevenue: 0,
    totalOrders: 0,
    monthlyOrders: 0,
    averageOrderValue: 0,
    monthlyGrowth: 0,
    topProducts: [],
    revenueChart: [],
    orderChart: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7days"); // 7days, 30days, 90days, 1year

  useEffect(() => {
    const loadRevenueStats = async () => {
      try {
        setLoading(true);
        console.log(`Loading revenue stats for ${timeRange}...`);
        const data = await getRevenueStats(timeRange);
        console.log("Received revenue data:", data);
        console.log("Revenue chart data:", data.revenueChart);
        console.log("Order chart data:", data.orderChart);

        // Don't create default data, let it show real data or no-data message
        setStats(data);
      } catch (err) {
        console.error("Error fetching revenue stats:", err);
        // Set mock data as fallback
        setStats({
          totalRevenue: 0,
          monthlyRevenue: 0,
          dailyRevenue: 0,
          totalOrders: 0,
          monthlyOrders: 0,
          averageOrderValue: 0,
          monthlyGrowth: 0,
          topProducts: [],
          revenueChart: [],
          orderChart: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadRevenueStats();
  }, [timeRange]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (value) => {
    return value >= 0 ? "#22c55e" : "#ef4444";
  };

  const createDefaultChartData = (type) => {
    const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    return days.map((day) => ({
      date: day,
      [type]: 0,
    }));
  };

  if (loading) {
    return (
      <div className="admin-revenue-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải dữ liệu doanh thu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-revenue-page">
      <div className="admin-revenue-header">
        <h1 className="admin-revenue-title">Báo cáo doanh thu</h1>
        <div className="admin-revenue-desc">
          Thống kê chi tiết về doanh thu và đơn hàng
        </div>

        <div className="time-range-selector">
          <button
            className={`time-btn ${timeRange === "7days" ? "active" : ""}`}
            onClick={() => setTimeRange("7days")}
          >
            7 ngày
          </button>
          <button
            className={`time-btn ${timeRange === "30days" ? "active" : ""}`}
            onClick={() => setTimeRange("30days")}
          >
            30 ngày
          </button>
          <button
            className={`time-btn ${timeRange === "90days" ? "active" : ""}`}
            onClick={() => setTimeRange("90days")}
          >
            3 tháng
          </button>
          <button
            className={`time-btn ${timeRange === "1year" ? "active" : ""}`}
            onClick={() => setTimeRange("1year")}
          >
            1 năm
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {formatCurrency(stats.totalRevenue || 0)}
            </div>
            <div className="metric-label">Tổng doanh thu</div>
            <div
              className="metric-growth"
              style={{ color: getGrowthColor(stats.monthlyGrowth || 0) }}
            >
              <i
                className={`fas fa-arrow-${
                  (stats.monthlyGrowth || 0) >= 0 ? "up" : "down"
                }`}
              ></i>
              {formatPercentage(stats.monthlyGrowth || 0)} so với tháng trước
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {(stats.totalOrders || 0).toLocaleString()}
            </div>
            <div className="metric-label">Tổng đơn hàng</div>
            <div className="metric-growth">
              <i className="fas fa-calendar-alt"></i>
              {stats.monthlyOrders || 0} đơn trong tháng
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {formatCurrency(stats.averageOrderValue || 0)}
            </div>
            <div className="metric-label">Giá trị đơn hàng TB</div>
            <div className="metric-growth">
              <i className="fas fa-info-circle"></i>
              Trung bình mỗi đơn
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="metric-content">
            <div className="metric-value">
              {formatCurrency(stats.dailyRevenue || 0)}
            </div>
            <div className="metric-label">Doanh thu hôm nay</div>
            <div className="metric-growth">
              <i className="fas fa-clock"></i>
              Cập nhật realtime
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Biểu đồ doanh thu</h3>
            <div className="chart-legend">
              <span className="legend-item revenue">
                <span className="legend-color"></span>
                Doanh thu
              </span>
            </div>
          </div>
          <div className="chart-placeholder">
            {stats.revenueChart &&
            Array.isArray(stats.revenueChart) &&
            stats.revenueChart.length > 0 ? (
              <div className="chart-bars">
                {stats.revenueChart.map((item, index) => {
                  console.log(`Revenue chart item ${index}:`, item);
                  const allRevenues = stats.revenueChart.map(
                    (i) => Number(i.revenue) || 0
                  );
                  const maxRevenue = Math.max(...allRevenues, 1); // Ensure at least 1 to avoid division by 0
                  const currentRevenue = Number(item.revenue) || 0;
                  const height = Math.max(
                    (currentRevenue / maxRevenue) * 80 + 10,
                    10
                  ); // Scale to 80% max + 10% min

                  console.log(
                    `Item ${index}: revenue=${currentRevenue}, maxRevenue=${maxRevenue}, height=${height}%`
                  );

                  return (
                    <div key={index} className="bar-item">
                      <div
                        className="bar revenue-bar"
                        style={{
                          height: `${height}%`,
                          backgroundColor: currentRevenue > 0 ? "" : "#e5e7eb", // Gray for zero values
                        }}
                        title={`${item.date}: ${formatCurrency(
                          currentRevenue
                        )}`}
                      ></div>
                      <div className="bar-label">{item.date}</div>
                      <div className="bar-value">
                        {currentRevenue > 0
                          ? formatCurrency(currentRevenue)
                          : "0đ"}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-data">
                <i className="fas fa-chart-line"></i>
                <p>Đang tải dữ liệu biểu đồ...</p>
                <div
                  style={{ marginTop: "10px", fontSize: "12px", color: "#999" }}
                >
                  Debug:{" "}
                  {stats.revenueChart
                    ? `Array length: ${stats.revenueChart.length}`
                    : "No chart data"}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Biểu đồ đơn hàng</h3>
            <div className="chart-legend">
              <span className="legend-item orders">
                <span className="legend-color"></span>
                Số đơn hàng
              </span>
            </div>
          </div>
          <div className="chart-placeholder">
            {stats.orderChart &&
            Array.isArray(stats.orderChart) &&
            stats.orderChart.length > 0 ? (
              <div className="chart-bars">
                {stats.orderChart.map((item, index) => {
                  console.log(`Order chart item ${index}:`, item);
                  const allOrders = stats.orderChart.map(
                    (i) => Number(i.orders) || 0
                  );
                  const maxOrders = Math.max(...allOrders, 1); // Ensure at least 1
                  const currentOrders = Number(item.orders) || 0;
                  const height = Math.max(
                    (currentOrders / maxOrders) * 80 + 10,
                    10
                  ); // Scale to 80% max + 10% min

                  console.log(
                    `Item ${index}: orders=${currentOrders}, maxOrders=${maxOrders}, height=${height}%`
                  );

                  return (
                    <div key={index} className="bar-item">
                      <div
                        className="bar order-bar"
                        style={{
                          height: `${height}%`,
                          backgroundColor: currentOrders > 0 ? "" : "#e5e7eb", // Gray for zero values
                        }}
                        title={`${item.date}: ${currentOrders} đơn`}
                      ></div>
                      <div className="bar-label">{item.date}</div>
                      <div className="bar-value">{currentOrders}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-data">
                <i className="fas fa-shopping-cart"></i>
                <p>Đang tải dữ liệu biểu đồ...</p>
                <div
                  style={{ marginTop: "10px", fontSize: "12px", color: "#999" }}
                >
                  Debug:{" "}
                  {stats.orderChart
                    ? `Array length: ${stats.orderChart.length}`
                    : "No chart data"}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Products */}
      {/* <div className="top-products-section">
        <h3>Sản phẩm bán chạy</h3>
        <div className="top-products-grid">
          {stats.topProducts.map((product, index) => (
            <div key={product._id} className="product-card">
              <div className="product-rank">#{index + 1}</div>
              <div className="product-image">
                <img 
                  src={product.imageUrl || '/assets/placeholder-product.png'} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = '/assets/placeholder-product.png';
                  }}
                />
              </div>
              <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-stats">
                  <div className="product-sold">{product.totalSold} đã bán</div>
                  <div className="product-revenue">{formatCurrency(product.revenue)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default AdminRevenue;
