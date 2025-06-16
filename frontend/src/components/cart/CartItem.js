import React from "react";
import { FiImage, FiTrash2 } from "react-icons/fi";
import { MdDesignServices } from "react-icons/md";
import SizeSelector from "./SizeSelector";
import PetTypeSelector from "./PetTypeSelector";
import ColorSelector from "./ColorSelector";
import QuantityControl from "./QuantityControl";

const CartItem = ({
  item,
  availableSizes,
  editingSizeItem,
  editingPetTypeItem,
  editingColorItem,
  addingSizeItemId,
  onOpenSizeSelector,
  onCloseSizeSelector,
  onOpenPetTypeSelector,
  onClosePetTypeSelector,
  onOpenColorSelector,
  onCloseColorSelector,
  onSizeChange,
  onPetTypeChange,
  onColorChange,
  onUpdateQuantity,
  onRemoveItem,
  onAddSameProductDifferentSize,
}) => {
  // Safe data extraction with defaults
  const itemId = item._id || "";
  const itemPrice = typeof item.price === "number" ? item.price : 0;
  const itemQuantity = typeof item.quantity === "number" ? item.quantity : 1;
  const productName = item.design?.name || item.product?.name || "Sản phẩm";
  const productDescription =
    item.design?.description || item.product?.description || "";

  // Show design fee info for custom designs
  const isCustomDesign = !!item.design;
  const designFee = item.product?.designFee || 80000;

  // Format prices
  const formattedUnitPrice = itemPrice.toLocaleString();
  const formattedTotalPrice = (itemPrice * itemQuantity).toLocaleString();

  // Check if item is loading
  const isItemLoading = item.isLoading || addingSizeItemId === item._id;

  const handleImageError = (e) => {
    console.error("Image failed to load:", e.target.src);
    e.target.style.display = "none";
    e.target.nextSibling.style.display = "flex";
  };

  return (
    <div className={`cart-item ${isItemLoading ? "item-loading" : ""}`}>
      <div className="item-preview">
        {item.design ? (
          <div className="custom-design-preview">
            <img
              src={
                item.design.previewImageUrl ||
                item.design.finalImageUrl ||
                `http://localhost:5000${
                  item.design.previewImage || item.design.finalImage
                }`
              }
              alt="Custom Design"
              className="product-image"
              onError={handleImageError}
            />
            <div className="custom-badge">
              <MdDesignServices />
              CUSTOM
            </div>
          </div>
        ) : item.product?.mockupImageUrl ? (
          <img
            src={item.product.mockupImageUrl}
            alt={productName}
            className="product-image"
            onError={handleImageError}
          />
        ) : (
          <div className="preview-placeholder">
            <FiImage />
            Xem thiết kế
          </div>
        )}
      </div>

      <div className="item-info">
        <div className="item-details">
          <h3 className="product-name">{productName}</h3>
          <p className="product-description">
            {productDescription}
            {item.weightRange && (
              <span className="weight-info">
                {" • Phù hợp: " + item.weightRange}
              </span>
            )}
          </p>

          {isCustomDesign && (
            <div className="price-breakdown">
              <small className="price-detail">
                Bao gồm phí thiết kế: {designFee.toLocaleString()}đ
              </small>
            </div>
          )}

          <PetTypeSelector
            itemId={itemId}
            currentPetType={item.petType}
            petTypeDisplay={item.petTypeDisplay}
            weightRange={item.weightRange}
            isOpen={editingPetTypeItem === itemId}
            onOpenSelector={onOpenPetTypeSelector}
            onCloseSelector={onClosePetTypeSelector}
            onPetTypeChange={onPetTypeChange}
          />

          <ColorSelector
            itemId={itemId}
            currentColor={item.color}
            availableColors={item.product?.colors}
            isOpen={editingColorItem === itemId}
            onOpenSelector={onOpenColorSelector}
            onCloseSelector={onCloseColorSelector}
            onColorChange={onColorChange}
          />

          <SizeSelector
            itemId={itemId}
            currentSize={item.size}
            availableSizes={availableSizes}
            isOpen={editingSizeItem === itemId}
            addingSizeItemId={addingSizeItemId}
            onOpenSelector={onOpenSizeSelector}
            onCloseSelector={onCloseSizeSelector}
            onSizeChange={onSizeChange}
            onAddSameProductDifferentSize={onAddSameProductDifferentSize}
            item={item}
          />
        </div>

        <div className="item-actions">
          <QuantityControl
            itemId={itemId}
            quantity={itemQuantity}
            onUpdateQuantity={onUpdateQuantity}
          />

          <div className="price-section">
            <div className="price-breakdown-detail">
              {item.baseCost > 0 && (
                <small className="base-cost">
                  Giá cơ bản: {item.baseCost.toLocaleString()}đ
                </small>
              )}
              {item.designFee > 0 && (
                <small className="design-fee">
                  Phí thiết kế: {item.designFee.toLocaleString()}đ
                </small>
              )}
            </div>
            <p className="unit-price">{formattedUnitPrice}đ/cái</p>
            <p className="total-price">{formattedTotalPrice}đ</p>
          </div>
        </div>
      </div>

      <button
        className="remove-button"
        onClick={() => onRemoveItem(itemId)}
        title="Xóa khỏi giỏ hàng"
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

export default CartItem;
