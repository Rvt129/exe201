import React, { useEffect, useRef } from "react";

const ColorSelector = ({
  itemId,
  currentColor,
  availableColors,
  isOpen,
  onOpenSelector,
  onCloseSelector,
  onColorChange,
}) => {
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onCloseSelector();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onCloseSelector]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onCloseSelector();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
      return () => {
        document.removeEventListener("keydown", handleEscapeKey);
      };
    }
  }, [isOpen, onCloseSelector]);

  const handleColorSelect = (color) => {
    onColorChange(itemId, color);
  };

  return (
    <div className="color-selector" ref={dropdownRef}>
      <div
        className={`color-tag ${isOpen ? "active" : ""}`}
        onClick={() => onOpenSelector(itemId)}
      >
        <div
          className="color-preview"
          style={{
            backgroundColor: currentColor?.hexCode || "#e2e8f0",
            backgroundImage: !currentColor?.hexCode
              ? "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)"
              : "none",
            backgroundSize: !currentColor?.hexCode ? "4px 4px" : "auto",
            backgroundPosition: !currentColor?.hexCode
              ? "0 0, 0 2px, 2px -2px, -2px 0px"
              : "auto",
          }}
        ></div>
        Màu: {currentColor?.name || "Chọn màu"}
        <span className="edit-icon">✎</span>
      </div>

      {isOpen && (
        <div className="color-dropdown">
          <div className="dropdown-header">
            <h4>Chọn màu sắc</h4>
            <button
              className="close-dropdown"
              onClick={onCloseSelector}
              type="button"
            >
              ✕
            </button>
          </div>
          <div className="color-options">
            {availableColors && availableColors.length > 0 ? (
              availableColors.map((color, colorIndex) => (
                <button
                  key={`color-${colorIndex}-${color.name || colorIndex}`}
                  className={`color-option-cart ${
                    currentColor?.name === color.name ? "selected" : ""
                  }`}
                  onClick={() => handleColorSelect(color)}
                  title={color.name}
                  type="button"
                >
                  <div
                    className="color-swatch"
                    style={{
                      backgroundColor: color.hexCode || "#000000",
                    }}
                  ></div>
                  <span>{color.name || "Không tên"}</span>
                </button>
              ))
            ) : (
              <div className="no-colors-message">
                <p>Không có màu sắc nào để chọn</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSelector;
