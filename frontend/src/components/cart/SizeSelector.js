import React from "react";
import { FiTag } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";

const SizeSelector = ({
  itemId,
  currentSize,
  availableSizes,
  isOpen,
  addingSizeItemId,
  onOpenSelector,
  onCloseSelector,
  onSizeChange,
  onAddSameProductDifferentSize,
  item,
}) => {
  return (
    <div className="size-selector">
      <div
        className={`size-tag ${isOpen ? "active" : ""}`}
        onClick={() => onOpenSelector(itemId)}
      >
        <FiTag />
        Size: {currentSize || "Chọn size"}
        <span className="edit-icon">✎</span>
      </div>

      {isOpen && (
        <div className="size-dropdown">
          <div className="size-dropdown-header">
            <h4>Chọn size cho thú cưng</h4>
            <button
              className="close-dropdown"
              onClick={() => onCloseSelector()}
            >
              ✕
            </button>
          </div>
          <div className="size-options">
            {availableSizes.map((size) => (
              <button
                key={size}
                className={`size-option ${
                  currentSize === size ? "selected" : ""
                }`}
                onClick={() => onSizeChange(itemId, size)}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="size-dropdown-footer">
            <p>Muốn thêm sản phẩm này với size khác?</p>
            <div className="add-size-options">
              {availableSizes
                .filter((size) => size !== currentSize)
                .map((size) => (
                  <button
                    key={`add-${size}`}
                    className="add-size-btn"
                    onClick={() => onAddSameProductDifferentSize(item, size)}
                    disabled={addingSizeItemId !== null}
                  >
                    {addingSizeItemId === itemId ? (
                      <span className="btn-loading">
                        <BiLoaderAlt className="spinning" /> Đang thêm...
                      </span>
                    ) : (
                      <span>+ Thêm size {size}</span>
                    )}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SizeSelector;
