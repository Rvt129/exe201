import React, { useEffect, useState } from "react";
import { getMyDesigns, updateDesign } from "../../../services/designs";
import { useNavigate } from "react-router-dom";
import "./MyDesigns.css";
import { useToastContext } from "../../../contexts/ToastContext";

function MyDesigns() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDesigns, setTotalDesigns] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const designsPerPage = 6;

  const navigate = useNavigate();
  const { success, error: toastError, warning } = useToastContext();

  useEffect(() => {
    fetchDesigns(1);
  }, []);

  const fetchDesigns = async (page) => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        warning("Bạn cần đăng nhập để xem thiết kế của mình.");
        setLoading(false);
        return;
      }

      const data = await getMyDesigns(token, page, designsPerPage);
      setDesigns(data.designs || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 0);
      setTotalDesigns(data.totalDesigns || 0);
      setHasNextPage(data.hasNextPage || false);
      setHasPrevPage(data.hasPrevPage || false);
    } catch (err) {
      const errorMessage = "Lỗi khi tải thiết kế: " + err.message;
      setError(errorMessage);
      toastError(errorMessage);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchDesigns(newPage);
    }
  };

  // Toggle public/private status
  const handleTogglePublic = async (designId, currentPublicStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        warning("Bạn cần đăng nhập để thay đổi trạng thái thiết kế.");
        return;
      }

      await updateDesign(designId, { isPublic: !currentPublicStatus }, token);

      // Update local state
      setDesigns((prevDesigns) =>
        prevDesigns.map((design) =>
          design._id === designId
            ? { ...design, isPublic: !currentPublicStatus }
            : design
        )
      );

      success(
        !currentPublicStatus
          ? "Thiết kế đã được đặt thành công khai"
          : "Thiết kế đã được đặt thành riêng tư"
      );
    } catch (err) {
      toastError("Lỗi khi thay đổi trạng thái thiết kế: " + err.message);
    }
  };

  const handleView = (designId) => {
    navigate(`/designs/${designId}`);
  };

  return (
    <div className="my-designs-page">
      <div className="my-designs-header">
        <h2>
          <span role="img" aria-label="paw" className="paw-icon">
            🐾
          </span>
          Thiết kế của tôi
        </h2>
        <p className="my-designs-subtitle">
          Quản lý các mẫu áo thú cưng bạn đã sáng tạo và lưu lại.
        </p>
        {totalDesigns > 0 && (
          <p className="designs-count">Tổng cộng: {totalDesigns} thiết kế</p>
        )}
      </div>
      <div className="my-designs-content">
        {loading && (
          <div className="my-designs-loading">
            <div className="spinner"></div>
            Đang tải thiết kế...
          </div>
        )}
        {error && <div className="my-designs-error">{error}</div>}
        {!loading && !error && designs.length === 0 && (
          <div className="my-designs-empty">
            <span role="img" aria-label="empty" className="empty-icon">
              🐶
            </span>
            <h3>Bạn chưa có thiết kế nào</h3>
            <p>
              Hãy bắt đầu sáng tạo những mẫu áo thú cưng độc đáo cho riêng bạn!
            </p>
            <button
              className="my-designs-create-btn"
              onClick={() => navigate("/design-studio")}
            >
              + Tạo thiết kế mới
            </button>
          </div>
        )}
        <div className="my-designs-list">
          {designs.map((design) => (
            <div className="design-card" key={design._id}>
              <div className="design-card-img-wrap">
                <img
                  src={
                    design.previewImage?.startsWith("/")
                      ? `http://localhost:5000${design.previewImage}`
                      : design.previewImage
                  }
                  alt={design.name}
                  className="design-card-img"
                />
                {design.isPublic && (
                  <span className="design-badge public">Công khai</span>
                )}
                {!design.isPublic && (
                  <span className="design-badge private">Riêng tư</span>
                )}
              </div>
              <div className="design-card-body">
                <div className="design-card-title">{design.name}</div>
                <div className="design-card-desc">
                  {design.description || "Không có mô tả"}
                </div>
                <div className="design-card-tags">
                  {design.tags &&
                    design.tags.map((tag) => (
                      <span className="design-tag" key={tag}>
                        #{tag}
                      </span>
                    ))}
                </div>
                <button
                  className={`design-card-btn toggle-public-btn ${
                    design.isPublic ? "public" : "private"
                  }`}
                  style={{
                    marginTop: 8,
                    background: design.isPublic ? "#dc3545" : "#28a745",
                    color: "#fff",
                  }}
                  onClick={() =>
                    handleTogglePublic(design._id, design.isPublic)
                  }
                >
                  <i
                    className={`fas ${
                      design.isPublic ? "fa-eye-slash" : "fa-eye"
                    }`}
                  ></i>
                  {design.isPublic ? "Chuyển riêng tư" : "Chuyển công khai"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevPage}
              >
                <i className="fas fa-chevron-left"></i>
                Trước
              </button>

              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1;
                  const isCurrentPage = pageNumber === currentPage;

                  // Only show pages around current page to avoid too many buttons
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNumber}
                        className={`pagination-number ${
                          isCurrentPage ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span key={pageNumber} className="pagination-ellipsis">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
              >
                Sau
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            <div className="pagination-info">
              Trang {currentPage} / {totalPages}(
              {designsPerPage * (currentPage - 1) + 1} -{" "}
              {Math.min(designsPerPage * currentPage, totalDesigns)} /{" "}
              {totalDesigns})
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyDesigns;
