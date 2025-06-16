import React from "react";

function RightToolbar({
  handleSave,
  handleAddToCart,
  handleOrder,
  handlePrint,
  handleDownload,
}) {
  return (
    <div className="right-toolbar-container">
      {/* Save & Share Section */}
      <div className="save-section">
        <div className="section-title">
          <i className="fas fa-save fa-sm"></i>
          Lưu & Chia Sẻ
        </div>
        <p className="section-description">
          Lưu thiết kế của bạn để sử dụng sau hoặc chia sẻ với bạn bè
        </p>
        <div className="primary-actions">
          <button onClick={handleSave} className="cta-button primary">
            <i className="fas fa-save fa-sm"></i>
            Lưu Thiết Kế
          </button>
          <button onClick={handleAddToCart} className="cta-button secondary">
            <i className="fas fa-shopping-cart fa-sm"></i>
            Thêm Vào Giỏ
          </button>
          <button onClick={handleOrder} className="cta-button primary">
            <i className="fas fa-shopping-bag fa-sm"></i>
            Đặt Hàng Ngay
          </button>
        </div>
      </div>

      {/* Export Section */}
      <div className="export-section">
        <div className="section-title">
          <i className="fas fa-download fa-sm"></i>
          Xuất File & In Ấn
        </div>
        <p className="section-description">
          Tải xuống thiết kế dưới dạng file in hoặc xem trước kết quả in
        </p>
        <div className="export-actions">
          <button onClick={handlePrint} className="cta-button outline">
            <i className="fas fa-print fa-sm"></i>
            Xem Trước In
          </button>
          <button onClick={handleDownload} className="cta-button outline">
            <i className="fas fa-download fa-sm"></i>
            Tải File In
          </button>
        </div>
        <div className="export-note">
          <i className="fas fa-info-circle fa-sm"></i>
          File tải về có nền trong suốt, phù hợp cho việc in ấn chuyên nghiệp
        </div>
      </div>

      {/* Quick Tips */}
      <div className="tips-section">
        <div className="section-title">
          <i className="fas fa-lightbulb fa-sm"></i>
          Mẹo Thiết Kế
        </div>
        <div className="tips-list">
          <div className="tip-item">
            <i className="fas fa-mouse-pointer fa-sm"></i>
            <span>Nhấp đúp vào text để chỉnh sửa nội dung</span>
          </div>
          <div className="tip-item">
            <i className="fas fa-arrows-alt fa-sm"></i>
            <span>Kéo thả để di chuyển đối tượng</span>
          </div>
          <div className="tip-item">
            <i className="fas fa-square fa-sm"></i>
            <span>Thiết kế phải nằm trong khung màu xanh</span>
          </div>
          <div className="tip-item">
            <i className="fas fa-undo fa-sm"></i>
            <span>Sử dụng Ctrl+Z để hoàn tác thao tác</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightToolbar;
