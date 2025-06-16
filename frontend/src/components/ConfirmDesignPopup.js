import React, { useState } from "react";
import "./ConfirmDesignPopup.css";

function ConfirmDesignPopup({
  isOpen,
  onClose,
  onConfirm,
  defaultName = "",
  previewImage = null,
}) {
  const [designName, setDesignName] = useState(defaultName);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (designName.trim()) {
      onConfirm(designName.trim());
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Xác nhận lưu thiết kế</h2>
        {previewImage && (
          <div
            className="preview-image-wrapper"
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            <img
              src={previewImage}
              alt="Mockup thực tế"
              style={{
                maxWidth: "260px",
                maxHeight: "260px",
                border: "2px solid #007bff",
                borderRadius: 10,
                marginBottom: 8,
              }}
            />
            <div style={{ fontSize: "0.95rem", color: "#555", marginTop: 4 }}>
              Ảnh mockup thực tế sản phẩm của bạn
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="designName">Tên thiết kế:</label>
          <input
            id="designName"
            type="text"
            value={designName}
            onChange={(e) => setDesignName(e.target.value)}
            placeholder="Nhập tên thiết kế của bạn"
            autoFocus
            required
          />
          <div className="popup-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Hủy
            </button>
            <button type="submit" className="confirm-btn">
              Lưu thiết kế
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ConfirmDesignPopup;
