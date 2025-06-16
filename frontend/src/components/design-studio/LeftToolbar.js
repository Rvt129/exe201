import React from "react";

function LeftToolbar({
  clothingType,
  setClothingType,
  products = [],
  shirtColors = [],
  baseColor,
  setBaseColor,
  addText,
  handleImageUpload,
  selectedTool,
  setSelectedTool,
  deleteSelected,
  clearDesign,
}) {
  const handleToolSelect = (tool) => {
    setSelectedTool(tool);
    if (tool === "text") {
      addText();
    }
  };

  return (
    <div className="left-toolbar-container">
      {/* Product Selection Section */}
      <div className="tool-section">
        <div className="section-title">
          <i className="fas fa-tshirt fa-sm"></i>
          Chọn Sản Phẩm
        </div>
        <select
          value={clothingType}
          onChange={(e) => setClothingType(e.target.value)}
          className="tool-select"
        >
          <option value="">Chọn loại trang phục</option>
          {products.map((prod) => (
            <option key={prod._id} value={prod._id}>
              {prod.name}
            </option>
          ))}
        </select>
      </div>

      {/* Color Selection */}
      {shirtColors.length > 0 && (
        <div className="tool-section">
          <div className="section-title">
            <i className="fas fa-palette fa-sm"></i>
            Màu Sắc Áo ({shirtColors.length} màu)
          </div>
          <div className="color-grid">
            {shirtColors.map((color) => (
              <div
                key={color.name}
                className={`modern-color-option ${
                  baseColor === color.name ? "selected" : ""
                }`}
                onClick={() => setBaseColor(color.name)}
                title={color.name}
              >
                <div className="color-image-container">
                  {color.mockupImageUrl ? (
                    <img
                      src={color.mockupImageUrl}
                      alt={color.name}
                      className="color-preview"
                    />
                  ) : (
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: color.hexCode || "#ccc" }}
                    >
                      {color.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="color-name">{color.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Design Tools */}
      <div className="tool-section">
        <div className="section-title">
          <i className="fas fa-tools fa-sm"></i>
          Công Cụ Thiết Kế
        </div>
        <div className="tools-grid">
          <button
            className={`tool-button ${
              selectedTool === "select" ? "active" : ""
            }`}
            onClick={() => handleToolSelect("select")}
            title="Chọn và di chuyển"
          >
            <i className="fas fa-mouse-pointer fa-sm"></i>
            Chọn
          </button>
          <button
            className={`tool-button ${selectedTool === "text" ? "active" : ""}`}
            onClick={() => handleToolSelect("text")}
            title="Thêm văn bản"
          >
            <i className="fas fa-font fa-sm"></i>
            Văn Bản
          </button>
          <label className="tool-button" title="Thêm hình ảnh">
            <i className="fas fa-image fa-sm"></i>
            Hình Ảnh
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="tool-section">
        <div className="section-title">
          <i className="fas fa-cogs fa-sm"></i>
          Thao Tác
        </div>
        <div className="action-buttons">
          <button
            onClick={deleteSelected}
            className="action-button danger"
            title="Xóa đối tượng đã chọn"
          >
            <i className="fas fa-trash fa-sm"></i>
            Xóa Đối Tượng
          </button>
          <button
            onClick={clearDesign}
            className="action-button secondary"
            title="Xóa toàn bộ thiết kế"
          >
            <i className="fas fa-eraser fa-sm"></i>
            Xóa Thiết Kế
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeftToolbar;
