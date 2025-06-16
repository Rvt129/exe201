import React from "react";
import { GiDogHouse, GiCat } from "react-icons/gi";

const PetTypeSelector = ({
  itemId,
  currentPetType,
  petTypeDisplay,
  weightRange,
  isOpen,
  onOpenSelector,
  onCloseSelector,
  onPetTypeChange,
}) => {
  return (
    <div className="pet-type-selector">
      <div
        className={`pet-type-tag ${isOpen ? "active" : ""}`}
        onClick={() => onOpenSelector(itemId)}
      >
        {currentPetType === "dog" ? <GiDogHouse /> : <GiCat />}
        {petTypeDisplay || "Chọn loại thú cưng"}
        <span className="edit-icon">✎</span>
      </div>

      {isOpen && (
        <div className="pet-type-dropdown">
          <div className="dropdown-header">
            <h4>Chọn loại thú cưng</h4>
            <button
              className="close-dropdown"
              onClick={() => onCloseSelector()}
            >
              ✕
            </button>
          </div>
          <div className="pet-type-options">
            <button
              className={`pet-type-option ${
                currentPetType === "dog" ? "selected" : ""
              }`}
              onClick={() => onPetTypeChange(itemId, "dog")}
            >
              <GiDogHouse />
              <span>
                Chó
                {weightRange && currentPetType === "dog" && (
                  <small>({weightRange})</small>
                )}
              </span>
            </button>
            <button
              className={`pet-type-option ${
                currentPetType === "cat" ? "selected" : ""
              }`}
              onClick={() => onPetTypeChange(itemId, "cat")}
            >
              <GiCat />
              <span>
                Mèo
                {weightRange && currentPetType === "cat" && (
                  <small>({weightRange})</small>
                )}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetTypeSelector;
