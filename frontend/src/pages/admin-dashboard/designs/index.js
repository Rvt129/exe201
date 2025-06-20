import React, { useEffect, useState } from "react";
import { getAllDesignsForAdmin } from "../../../services/designs";
import "./designs.css";

const AdminDesigns = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDesigns, setTotalDesigns] = useState(0);
  const [designsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadDesigns = async () => {
      try {
        setLoading(true);
        const data = await getAllDesignsForAdmin(
          currentPage,
          designsPerPage,
          searchTerm
        );
        setDesigns(data.designs);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
        setTotalDesigns(data.totalDesigns);
      } catch (err) {
        console.error("Error fetching designs:", err);
        setDesigns([]);
        setTotalPages(0);
        setTotalDesigns(0);
      } finally {
        setLoading(false);
      }
    };

    loadDesigns();
  }, [currentPage, designsPerPage, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    // No need to call fetchDesigns here as useEffect will handle it when searchTerm changes
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (isPublic) => {
    return isPublic ? (
      <span className="status-public">Công khai</span>
    ) : (
      <span className="status-private">Riêng tư</span>
    );
  };

  if (loading && designs.length === 0) {
    return (
      <div style={{ padding: 32, fontSize: 18, textAlign: "center" }}>
        Đang tải thiết kế...
      </div>
    );
  }

  return (
    <div className="admin-designs-page">
      <div className="admin-designs-header">
        <h1 className="admin-designs-title">Quản lý thiết kế</h1>
        <div className="admin-designs-desc">
          Danh sách tất cả thiết kế của người dùng
        </div>
      </div>

      <div className="admin-designs-search-section">
        <form onSubmit={handleSearch} className="admin-designs-search">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên thiết kế..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </form>
      </div>

      <div className="admin-designs-table-wrapper">
        {loading && (
          <div className="table-loading-overlay">Đang cập nhật...</div>
        )}
        <table className="admin-designs-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên thiết kế</th>
              <th>Người tạo</th>
              <th>Sản phẩm</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {designs.map((design) => (
              <tr className="admin-designs-row" key={design._id}>
                <td>
                  <div className="design-image-container">
                    <img
                      src={process.env.REACT_APP_API_URL + design.previewImage}
                      alt={design.name}
                      className="design-preview-image"
                      onError={(e) => {
                        e.target.src = "/assets/placeholder-image.png";
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div className="design-name">
                    {design.name || "Chưa có tên"}
                  </div>
                  {design.description && (
                    <div className="design-description">
                      {design.description}
                    </div>
                  )}
                </td>
                <td>
                  <div className="user-info">
                    <div className="user-name">
                      {design.user?.firstName && design.user?.lastName
                        ? `${design.user.firstName} ${design.user.lastName}`
                        : "Người dùng ẩn danh"}
                    </div>
                    {design.user?.email && (
                      <div className="user-email">{design.user.email}</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="product-info">
                    <div className="product-name">
                      {design.product?.name || "Chưa có thông tin"}
                    </div>
                    <div className="product-type">
                      {design.product?.type || ""}
                    </div>
                  </div>
                </td>
                <td>{getStatusBadge(design.isPublic)}</td>
                <td>{formatDate(design.createdAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button className="admin-designs-btn view-btn">Xem</button>
                    <button className="admin-designs-btn delete-btn">
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && designs.length === 0 && (
        <div style={{ padding: 32, fontSize: 18, textAlign: "center" }}>
          Không có thiết kế nào.
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="pagination-btn prev-btn"
          >
            &lt;
          </button>
          <span className="pagination-info">
            Trang {currentPage} / {totalPages} (Tổng: {totalDesigns} thiết kế)
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="pagination-btn next-btn"
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDesigns;
