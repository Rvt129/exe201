import React, { useEffect, useRef } from "react";

function ContextMenu({
  show,
  position, // { x: clientX, y: clientY }
  onClose,
  onChangeColor, // For text objects
  onChangeFont, // For text objects
  onDelete,
  isTextObject,
  availableFonts = [],
  currentFontFamily, // For text objects
  currentTextColor, // For text objects
}) {
  const menuRef = useRef(null);

  // Handle click outside to close menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  // Adjust menu position to prevent it from going off-screen
  useEffect(() => {
    if (show && menuRef.current && position) {
      const menu = menuRef.current;
      // Temporarily make it visible to measure, then hide if needed, or position directly
      // menu.style.visibility = 'hidden'; // Avoid flicker by positioning first
      menu.style.left = `${position.x}px`;
      menu.style.top = `${position.y}px`;
      // menu.style.visibility = 'visible';

      const rect = menu.getBoundingClientRect();

      let finalX = position.x;
      let finalY = position.y;

      // Adjust horizontal position
      if (position.x + rect.width > window.innerWidth) {
        finalX = window.innerWidth - rect.width - 10; // 10px padding from edge
      } else if (position.x < 0) {
        finalX = 10; // 10px padding from edge
      }

      // Adjust vertical position
      if (position.y + rect.height > window.innerHeight) {
        finalY = window.innerHeight - rect.height - 10; // 10px padding from edge
      } else if (position.y < 0) {
        finalY = 10; // 10px padding from edge
      }

      menu.style.left = `${finalX}px`;
      menu.style.top = `${finalY}px`;
    }
  }, [show, position]);

  const handleColorInputChange = (e) => {
    onChangeColor(e.target.value); // Directly pass the new color value
  };

  const handleFontChange = (e) => {
    onChangeFont(e.target.value);
  };

  if (!show || !position) return null; // Don't render if not shown or no position

  return (
    <div
      ref={menuRef}
      className="context-menu"
      style={{
        position: "fixed",
        left: `${position.x}px`, // Initial position based on click
        top: `${position.y}px`, // Initial position based on click
        // Visibility will be handled by the `if (!show) return null;`
      }}
      // onMouseLeave={onClose} // Can be too aggressive; click outside is better
    >
      {isTextObject && (
        <>
          <div className="context-menu-item">
            <label htmlFor="context-color-picker">Màu chữ:</label>
            <input
              id="context-color-picker"
              type="color"
              value={currentTextColor} // Controlled component
              onChange={handleColorInputChange}
              className="context-color-picker"
            />
          </div>
          <div className="context-menu-item">
            <label htmlFor="context-font-selector">Font chữ:</label>
            <select
              id="context-font-selector"
              value={currentFontFamily} // Controlled component
              onChange={handleFontChange}
              className="context-font-selector"
            >
              {availableFonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      {/* The "Đổi màu" button for non-text objects was removed in a previous step,
          as color changes for images/shapes are usually more complex (e.g., filters, SVG manipulation)
          and not handled by a simple color picker. If this is needed, it requires specific logic.
      */}
      {/* {!isTextObject && (
        <div className="context-menu-item">
          <button onClick={onChangeColor} className="context-button">
            <i className="fas fa-palette fa-sm"></i> Đổi màu (Non-Text)
          </button>
        </div>
      )} */}
      <div className="context-menu-item">
        <button onClick={onDelete} className="context-button delete">
          <i className="fas fa-trash fa-sm"></i> Xóa
        </button>
      </div>
    </div>
  );
}

export default ContextMenu;
