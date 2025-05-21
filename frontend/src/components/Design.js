import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import "./Design.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Design() {
  const canvasRef = useRef(null);
  const previewRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [previewCanvas, setPreviewCanvas] = useState(null);
  const [selectedTool, setSelectedTool] = useState("select");
  const [petType, setPetType] = useState("dog");
  const [petSize, setPetSize] = useState("medium");
  const [baseColor, setBaseColor] = useState("#ffffff");
  const [clothingType, setClothingType] = useState("tshirt");
  const navigate = useNavigate();

  // Initialize main canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: "#ffffff",
      });

      // Add base clothing template
      const clothing = new fabric.Rect({
        width: 300,
        height: 400,
        fill: baseColor,
        stroke: "#000000",
        strokeWidth: 2,
        selectable: false,
      });

      canvas.add(clothing);
      canvas.centerObject(clothing);
      setCanvas(canvas);

      // Enable object controls
      canvas.on("object:modified", updatePreview);
      canvas.on("object:added", updatePreview);
      canvas.on("object:removed", updatePreview);

      return () => {
        canvas.dispose();
      };
    } catch (error) {
      console.error("Error initializing canvas:", error);
    }
  }, []);

  // Initialize preview canvas
  useEffect(() => {
    if (!previewRef.current) return;

    try {
      const previewCanvas = new fabric.Canvas(previewRef.current, {
        width: 300,
        height: 300,
        backgroundColor: "#f5f5f5",
      });
      setPreviewCanvas(previewCanvas);

      return () => {
        previewCanvas.dispose();
      };
    } catch (error) {
      console.error("Error initializing preview canvas:", error);
    }
  }, []);

  // Update preview when design changes
  const updatePreview = () => {
    if (!canvas || !previewCanvas) return;

    try {
      // Clear preview canvas
      previewCanvas.clear();

      // Load pet image based on type and size
      const petImageUrl = `/images/${petType}-${petSize}.png`;
      fabric.Image.fromURL(petImageUrl, (petImg) => {
        // Scale pet image to fit preview
        const scale = Math.min(300 / petImg.width, 300 / petImg.height);
        petImg.scale(scale);
        petImg.set({
          left: (300 - petImg.width * scale) / 2,
          top: (300 - petImg.height * scale) / 2,
        });
        previewCanvas.add(petImg);

        // Add design elements
        canvas.getObjects().forEach((obj) => {
          if (obj !== canvas.getObjects()[0]) {
            // Skip base clothing
            const clone = fabric.util.object.clone(obj);
            clone.scale(scale * 0.5); // Scale design to fit pet
            clone.set({
              left: (300 - clone.width * clone.scaleX) / 2,
              top: (300 - clone.height * clone.scaleY) / 2,
            });
            previewCanvas.add(clone);
          }
        });

        previewCanvas.renderAll();
      });
    } catch (error) {
      console.error("Error updating preview:", error);
    }
  };

  // Update clothing template when type or color changes
  useEffect(() => {
    if (!canvas) return;

    try {
      const objects = canvas.getObjects();
      if (objects.length > 0) {
        objects[0].set("fill", baseColor);
        canvas.renderAll();
        updatePreview();
      }
    } catch (error) {
      console.error("Error updating template:", error);
    }
  }, [clothingType, baseColor, canvas]);

  const addText = () => {
    if (!canvas) return;

    try {
      const text = new fabric.IText("Nhấp đúp để chỉnh sửa", {
        left: 100,
        top: 100,
        fontFamily: "Arial",
        fontSize: 20,
        fill: "#000000",
      });
      canvas.add(text);
      canvas.setActiveObject(text);
    } catch (error) {
      console.error("Lỗi khi lưu thiết kế:", error);
      alert("Lỗi khi lưu thiết kế. Vui lòng thử lại.");
    }
  };

  const addImage = (url) => {
    if (!canvas) return;

    try {
      fabric.Image.fromURL(url, (img) => {
        // Calculate scale to fit within canvas
        const maxWidth = canvas.width * 0.8;
        const maxHeight = canvas.height * 0.8;
        const scale = Math.min(maxWidth / img.width, maxHeight / img.height);

        img.scale(scale);
        img.set({
          left: (canvas.width - img.width * scale) / 2,
          top: (canvas.height - img.height * scale) / 2,
        });

        // Add controls for resizing and rotating
        img.setControlsVisibility({
          mt: true, // middle top
          mb: true, // middle bottom
          ml: true, // middle left
          mr: true, // middle right
          bl: true, // bottom left
          br: true, // bottom right
          tl: true, // top left
          tr: true, // top right
          mtr: true, // middle top rotate
        });

        canvas.add(img);
        canvas.setActiveObject(img);
      });
    } catch (error) {
      console.error("Error adding image:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      addImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!canvas) return;

    try {
      const data = canvas.toJSON();
      localStorage.setItem("design", JSON.stringify(data));
      alert("Lưu thiết kế thành công!");
    } catch (error) {
      console.error("Lỗi khi lưu thiết kế:", error);
      alert("Lỗi khi lưu thiết kế. Vui lòng thử lại.");
    }
  };

  const handleAddToCart = () => {
    if (!canvas) return;

    try {
      // Save the current design to localStorage
      const data = canvas.toJSON();
      const cartItem = {
        id: `Design${Date.now()}`,
        design: data,
        size: petSize,
        price: 160.0, // Base price
        customizationFee: 15.0,
        timestamp: new Date().toISOString(),
      };

      // Get existing cart items
      const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
      existingCart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(existingCart));

      alert("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ:", error);
      alert("Lỗi khi thêm vào giỏ. Vui lòng thử lại.");
    }
  };

  const handleOrder = () => {
    if (!canvas) return;

    try {
      // Save the current design to localStorage
      const data = canvas.toJSON();
      localStorage.setItem("design", JSON.stringify(data));

      // Navigate to the order page
      navigate("/order");
    } catch (error) {
      console.error("Lỗi khi lưu thiết kế:", error);
      alert("Lỗi khi lưu thiết kế. Vui lòng thử lại.");
    }
  };

  return (
    <div className="design-page">
      <Navbar />
      <div className="design-container">
        {/* Left Toolbar */}
        <div className="toolbar left-toolbar">
          <div className="tool-section">
            <h3>Loại Trang Phục</h3>
            <select
              value={clothingType}
              onChange={(e) => setClothingType(e.target.value)}
              className="tool-select"
            >
              <option value="tshirt">Áo Thun</option>
              <option value="hoodie">Áo Hoodie</option>
              <option value="sweater">Áo Len</option>
            </select>
          </div>

          <div className="tool-section">
            <h3>Màu Nền</h3>
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="color-picker"
            />
          </div>

          <div className="tool-section">
            <h3>Thêm Phần Tử</h3>
            <button onClick={addText} className="tool-button">
              Thêm Chữ
            </button>
            <label className="tool-button">
              Thêm Hình Ảnh
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div className="tool-section">
            <h3>Công Cụ</h3>
            <button
              onClick={() => setSelectedTool("select")}
              className={`tool-button ${
                selectedTool === "select" ? "active" : ""
              }`}
            >
              Chọn
            </button>
            <button
              onClick={() => setSelectedTool("move")}
              className={`tool-button ${
                selectedTool === "move" ? "active" : ""
              }`}
            >
              Di Chuyển
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="canvas-container">
          <canvas ref={canvasRef} />
        </div>

        {/* Right Preview Panel */}
        <div className="toolbar right-toolbar">
          <div className="tool-section">
            <h3>Xem Trước Thú Cưng</h3>
            <select
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              className="tool-select"
            >
              <option value="dog">Chó</option>
              <option value="cat">Mèo</option>
            </select>

            <select
              value={petSize}
              onChange={(e) => setPetSize(e.target.value)}
              className="tool-select"
            >
              <option value="small">Nhỏ</option>
              <option value="medium">Vừa</option>
              <option value="large">Lớn</option>
            </select>

            <div className="preview-container">
              <canvas ref={previewRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Design;
