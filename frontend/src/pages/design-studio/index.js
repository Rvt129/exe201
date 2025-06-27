import React, { useState, useEffect, useRef, useCallback } from "react";
import { fabric } from "fabric";
import "./Design.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import LeftToolbar from "../../components/design-studio/LeftToolbar";
import RightToolbar from "../../components/design-studio/RightToolbar";
import CanvasContainer from "../../components/design-studio/CanvasContainer";
import ContextMenu from "../../components/design-studio/ContextMenu"; // Import the new component
import ConfirmDesignPopup from "../../components/ConfirmDesignPopup";
import { fetchProducts } from "../../services/products";
import { saveDesign } from "../../services/designs";
import { addToCart } from "../../services/cart";
import { useToastContext } from "../../contexts/ToastContext";

function Design() {
  // Popup state
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [pendingSaveCallback, setPendingSaveCallback] = useState(null);
  const [pendingPreviewImage, setPendingPreviewImage] = useState(null);
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [selectedTool, setSelectedTool] = useState("select");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shirtColors, setShirtColors] = useState([]);
  const [baseColor, setBaseColor] = useState("");
  const [clothingType, setClothingType] = useState("");
  const [shirtImage, setShirtImage] = useState(null);
  const [designArea, setDesignArea] = useState({
    x: 250,
    y: 150,
    width: 300,
    height: 300,
  });
  const navigate = useNavigate();
  const { success, error, warning, info } = useToastContext();

  // New state for text properties
  const [currentTextColor, setCurrentTextColor] = useState("#000000");
  const [currentFontFamily, setCurrentFontFamily] = useState("Arial");
  // isTextSelected is primarily for LeftToolbar, can be removed if not used elsewhere.
  // For now, context menu logic might still use it indirectly via activeObject checks.
  // Let's keep isTextSelected state for now as updateTextControls updates it,
  // and it might be useful for other UI elements in the future, though LeftToolbar won't use it.
  const [isTextSelected, setIsTextSelected] = useState(false);

  const availableFonts = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Palatino",
    "Garamond",
    "Comic Sans MS",
    "Impact",
    "Pacifico", // Example of a Google Font if loaded
  ];

  // Add state for context menu
  const [contextMenu, setContextMenu] = useState({
    show: false,
    position: { x: 0, y: 0 },
    isTextObject: false,
  });

  // Fetch products from backend
  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
        if (data.length > 0) {
          setSelectedProduct(data[0]);
          setClothingType(data[0]._id);
          setShirtColors(data[0].colors || []);
          if (data[0].colors && data[0].colors.length > 0) {
            setBaseColor(data[0].colors[0].name);
          }
        }
      })
      .catch((err) => {
        console.error("Lỗi tải sản phẩm:", err);
      });
  }, []);

  // Khi chọn loại áo, cập nhật màu áo tương ứng
  useEffect(() => {
    if (!clothingType || !products.length) return;
    const prod = products.find((p) => p._id === clothingType) || null;
    setSelectedProduct(prod);
    setShirtColors(prod?.colors || []);
    if (prod?.colors && prod.colors.length > 0) {
      setBaseColor(prod.colors[0].name);
    }
  }, [clothingType, products]);

  // Load shirt image based on selected color
  const loadShirtImage = (canvas, colorName) => {
    const selectedColor = shirtColors.find((color) => color.name === colorName);
    if (!selectedColor) return;

    // Save existing design elements before clearing canvas
    const existingObjects = canvas.getObjects();
    const designElements = existingObjects.filter((obj) => {
      // Keep only user-added design elements (not the shirt or frame)
      return !obj.excludeFromExport && obj !== shirtImage;
    });

    // Clone design elements to restore after changing shirt
    const elementsToRestore = [];
    designElements.forEach((obj) => {
      // Create a deep clone of each object
      obj.clone(
        (cloned) => {
          elementsToRestore.push(cloned);
        },
        [
          "left",
          "top",
          "width",
          "height",
          "scaleX",
          "scaleY",
          "angle",
          "fill",
          "stroke",
          "strokeWidth",
          "fontSize",
          "fontFamily",
          "text",
          "textAlign",
          "src",
        ]
      );
    });

    // Determine image source - check if mockupImageUrl is a base64 string or a regular URL
    const imgUrl = selectedColor.mockupImageUrl
      ? selectedColor.mockupImageUrl.startsWith("data:")
        ? selectedColor.mockupImageUrl
        : selectedColor.mockupImageUrl
      : `/assets/images/${selectedColor.name}.png`;

    // If we have a base64 string or an image URL, load it
    fabric.Image.fromURL(
      imgUrl,
      (img) => {
        // Scale image to fit canvas
        const scale = Math.min(600 / img.width, 500 / img.height);
        img.scale(scale);
        // Center the shirt image
        img.set({
          left: (800 - img.width * scale) / 2,
          top: (600 - img.height * scale) / 2,
          selectable: false,
          evented: false,
          excludeFromExport: false,
        });
        // Clear canvas and add shirt as background
        canvas.clear();
        canvas.add(img);
        canvas.sendToBack(img);
        setShirtImage(img);

        // Add design area frame
        addDesignFrame(canvas, img);

        // Restore saved design elements
        elementsToRestore.forEach((obj) => {
          // Apply constraint to design area for each restored object
          constrainToDesignArea(obj);
          canvas.add(obj);
        });

        canvas.renderAll();
      },
      {
        // Add crossOrigin handler for network images (doesn't affect base64)
        crossOrigin: "anonymous",
      }
    );
  };

  // Add design frame/area on the shirt
  const addDesignFrame = (canvas, shirtImg) => {
    // Calculate design area position relative to shirt
    const shirtBounds = shirtImg.getBoundingRect();
    const frameWidth = 250;
    const frameHeight = 200;

    const frame = new fabric.Rect({
      left: shirtBounds.left + (shirtBounds.width - frameWidth) / 2,
      top: shirtBounds.top + shirtBounds.height * 0.3, // Position on chest area
      width: frameWidth,
      height: frameHeight,
      fill: "transparent",
      stroke: "#007bff",
      strokeWidth: 2,
      strokeDashArray: [5, 5],
      selectable: false,
      evented: false,
      excludeFromExport: true, // Don't include in final design
      name: "designFrame", // Đặt tên riêng để nhận dạng
    });

    canvas.add(frame);
    setDesignArea({
      x: frame.left,
      y: frame.top,
      width: frameWidth,
      height: frameHeight,
    });
  };

  // Initialize main canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    let fabricCanvasInstance; // Variable to hold the canvas instance for cleanup

    try {
      fabricCanvasInstance = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: "#f5f5f5",
        stopContextMenu: true, // Prevent Fabric from showing its own context menu
        fireRightClick: true, // Ensure right-click fires 'mouse:down' with button type
      });

      const currentCanvasRef = canvasRef.current; // Capture for cleanup

      // Optional: A single native contextmenu listener on the canvas itself as a fallback.
      // Fabric's stopContextMenu should handle this, but this is an extra layer.
      const handleNativeContextMenu = (e) => {
        e.preventDefault();
      };
      currentCanvasRef.addEventListener("contextmenu", handleNativeContextMenu);

      const handleMouseDown = (options) => {
        if (!options.e) return; // Event object guard

        currentCanvasRef.focus(); // Focus the canvas

        if (options.e.button === 2) {
          // Right-click
          options.e.preventDefault(); // Prevent default browser context menu
          options.e.stopPropagation(); // Stop event propagation

          const target = options.target;
          // Show context menu only if a valid design object is right-clicked
          if (target && target !== shirtImage && !target.excludeFromExport) {
            const isText =
              target.type === "i-text" || target.type === "textbox";
            setContextMenu({
              show: true,
              position: { x: options.e.clientX, y: options.e.clientY }, // Use screen coordinates
              isTextObject: isText,
            });
            fabricCanvasInstance.setActiveObject(target); // Select the object
          } else {
            // If right-clicked on empty space, shirt, or frame, hide the menu
            setContextMenu((prev) => ({ ...prev, show: false }));
          }
          fabricCanvasInstance.renderAll();
          // return false; // Can be useful in Fabric event handlers
        } else if (options.e.button === 0) {
          // Left-click
          // Hide context menu on any left click on the canvas
          setContextMenu((prev) => ({ ...prev, show: false }));
        }
      };
      fabricCanvasInstance.on("mouse:down", handleMouseDown);

      // Event listeners for text object selection (ensure these use fabricCanvasInstance)
      const updateTextControls = (activeObject) => {
        if (
          activeObject &&
          (activeObject.type === "i-text" || activeObject.type === "textbox")
        ) {
          setIsTextSelected(true);
          setCurrentTextColor(activeObject.get("fill") || "#000000");
          setCurrentFontFamily(activeObject.get("fontFamily") || "Arial");
        } else {
          setIsTextSelected(false);
        }
      };

      fabricCanvasInstance.on("selection:created", (e) => {
        if (e.selected && e.selected.length > 0)
          updateTextControls(e.selected[0]);
      });
      fabricCanvasInstance.on("selection:updated", (e) => {
        if (e.selected && e.selected.length > 0)
          updateTextControls(e.selected[0]);
      });
      fabricCanvasInstance.on("selection:cleared", () => {
        setIsTextSelected(false);
      });

      setCanvas(fabricCanvasInstance);

      return () => {
        // Cleanup
        if (currentCanvasRef) {
          currentCanvasRef.removeEventListener(
            "contextmenu",
            handleNativeContextMenu
          );
        }
        if (fabricCanvasInstance) {
          // fabricCanvasInstance.off("mouse:down", handleMouseDown); // Clean up specific listeners
          // fabricCanvasInstance.off("selection:created");
          // fabricCanvasInstance.off("selection:updated");
          // fabricCanvasInstance.off("selection:cleared");
          fabricCanvasInstance.dispose();
        }
        setCanvas(null);
      };
    } catch (error) {
      console.error("Error initializing canvas:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep dependencies minimal for one-time setup. shirtImage is accessed via closure.

  // Update shirt color when baseColor changes
  useEffect(() => {
    if (!canvas) return;
    // Ensure shirtImage is loaded before trying to use it in other functions
    loadShirtImage(canvas, baseColor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, baseColor]);

  // Constrain objects to design area
  const constrainToDesignArea = (obj) => {
    obj.on("moving", () => {
      let left = obj.left;
      let top = obj.top;
      const width = obj.width * obj.scaleX;
      const height = obj.height * obj.scaleY;

      // Trái
      if (left < designArea.x) left = designArea.x;
      // Trên
      if (top < designArea.y) top = designArea.y;
      // Phải
      if (left + width > designArea.x + designArea.width)
        left = designArea.x + designArea.width - width;
      // Dưới
      if (top + height > designArea.y + designArea.height)
        top = designArea.y + designArea.height - height;

      if (left !== obj.left || top !== obj.top) {
        obj.set({ left, top });
        obj.setCoords();
      }
    });

    // Also constrain when object is being scaled
    obj.on("scaling", () => {
      const objBound = obj.getBoundingRect();

      // If object exceeds bounds after scaling, limit the scale
      if (
        objBound.left < designArea.x ||
        objBound.top < designArea.y ||
        objBound.left + objBound.width > designArea.x + designArea.width ||
        objBound.top + objBound.height > designArea.y + designArea.height
      ) {
        // Calculate max scale that fits within design area
        const maxScaleX = designArea.width / obj.width;
        const maxScaleY = designArea.height / obj.height;
        const maxScale = Math.min(maxScaleX, maxScaleY, obj.scaleX, obj.scaleY);

        obj.set({
          scaleX: Math.min(obj.scaleX, maxScale),
          scaleY: Math.min(obj.scaleY, maxScale),
        });
        obj.setCoords();
      }
    });
  };

  const addText = () => {
    if (!canvas || !designArea) return;

    try {
      const text = new fabric.IText("Nhấp đúp để chỉnh sửa", {
        left: designArea.x + 20,
        top: designArea.y + 20,
        fontFamily: currentFontFamily, // Use current font
        fontSize: 20,
        fill: currentTextColor, // Use current color
      });

      // Constrain text to design area
      constrainToDesignArea(text);
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    } catch (error) {
      console.error("Lỗi khi thêm text:", error);
    }
  };

  const addImage = (url) => {
    if (!canvas) return;

    try {
      fabric.Image.fromURL(
        url,
        (img) => {
          // Calculate scale to fit within design area
          const maxWidth = designArea.width * 0.8;
          const maxHeight = designArea.height * 0.8;
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height);

          img.scale(scale);
          img.set({
            left: designArea.x + (designArea.width - img.width * scale) / 2,
            top: designArea.y + (designArea.height - img.height * scale) / 2,
            // Store the image URL for later use
            src: url,
          });

          // Add controls for resizing and rotating
          img.setControlsVisibility({
            mt: true,
            mb: true,
            ml: true,
            mr: true,
            bl: true,
            br: true,
            tl: true,
            tr: true,
            mtr: true,
          });

          // Constrain to design area
          constrainToDesignArea(img);
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
        },
        {
          // Add crossOrigin to handle CORS if needed
          crossOrigin: "anonymous",
        }
      );
    } catch (error) {
      console.error("Error adding image:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      warning("Vui lòng đăng nhập để upload ảnh!");
      return;
    }

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Data = event.target.result;

        try {
          info("Đang tải ảnh lên...");
          // Upload to backend and get URL
          const response = await fetch(
            process.env.REACT_APP_API_URL + "/api/designs/upload-image",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ imageBase64: base64Data }),
            }
          );

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
          }

          const result = await response.json();
          // Use the URL returned from backend
          addImage(result.imageUrl);
          success("Tải ảnh lên thành công!");
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          error("Lỗi khi upload ảnh. Vui lòng thử lại.");
          // Fallback to using base64 directly
          addImage(base64Data);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error handling image upload:", error);
      alert("Lỗi khi upload ảnh. Vui lòng thử lại.");
    }
  };

  // Delete selected object
  const deleteSelected = useCallback(() => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (
      activeObject &&
      activeObject !== shirtImage &&
      !activeObject.excludeFromExport
    ) {
      // Removed confirmation dialog
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, [canvas, shirtImage]);

  // Clear all design elements (keep shirt and frame)
  const clearDesign = () => {
    if (!canvas) return;

    const allObjects = canvas.getObjects();
    const designObjects = allObjects.filter(
      (obj) => obj !== shirtImage && !obj.excludeFromExport
    );

    if (designObjects.length === 0) {
      alert("Không có phần tử thiết kế nào để xóa!");
      return;
    }

    // Removed confirmation dialog
    designObjects.forEach((obj) => canvas.remove(obj));
    canvas.renderAll();
  };

  // Handle changing text color from context menu
  const handleContextColorChange = (color) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (
      activeObject &&
      (activeObject.type === "i-text" || activeObject.type === "textbox")
    ) {
      activeObject.set("fill", color);
      setCurrentTextColor(color); // Update state for consistency if needed elsewhere
      canvas.renderAll();
    }
    // Do not hide menu here, color picker might need multiple interactions
    // setContextMenu(prev => ({ ...prev, show: false }));
  };

  // Handle changing font from context menu
  const handleContextFontChange = (font) => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (
      activeObject &&
      (activeObject.type === "i-text" || activeObject.type === "textbox")
    ) {
      activeObject.set("fontFamily", font);
      setCurrentFontFamily(font); // Update state for consistency
      canvas.renderAll();
    }
    setContextMenu((prev) => ({ ...prev, show: false })); // Hide after selection
  };

  // Handle delete from context menu
  const handleContextDelete = () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (
      activeObject &&
      activeObject !== shirtImage &&
      !activeObject.excludeFromExport
    ) {
      // Removed confirmation dialog
      canvas.remove(activeObject);
      canvas.discardActiveObject();
      canvas.renderAll();
    }

    setContextMenu((prev) => ({ ...prev, show: false })); // Hide after action
  };

  // Generates base64 of the mockup preview (design on shirt)
  const generateMockupPreviewBase64 = useCallback(async (currentCanvas) => {
    if (!currentCanvas) return null;

    return new Promise((resolve) => {
      currentCanvas.clone((clonedCanvas) => {
        // Hide frame design
        clonedCanvas.getObjects().forEach((obj) => {
          if (obj.name === "designFrame" || obj.excludeFromExport) {
            obj.visible = false;
          }
        });

        const dataURL = clonedCanvas.toDataURL({
          format: "png",
          quality: 0.9, // Good quality for preview
          multiplier: 1, // Standard resolution for preview
        });
        clonedCanvas.dispose();
        resolve(dataURL);
      });
    });
  }, []);

  // Generates base64 of the clean design (for printing)
  const generateCleanDesignBase64 = useCallback(
    async (currentCanvas, currentDesignArea, currentShirtImage) => {
      if (!currentCanvas || !currentDesignArea || !currentShirtImage) {
        return null;
      }

      const designObjects = currentCanvas
        .getObjects()
        .filter((obj) => !obj.excludeFromExport && obj !== currentShirtImage);

      if (designObjects.length === 0) {
        console.log("No design objects to export for clean design.");
        return null;
      }

      const designFrame = currentCanvas
        .getObjects()
        .find((o) => o.name === "designFrame");
      if (designFrame) designFrame.set({ visible: false }); // Temporarily hide

      const tempCanvas = new fabric.StaticCanvas(null, {
        width: currentDesignArea.width,
        height: currentDesignArea.height,
        backgroundColor: "transparent",
      });

      const clonePromises = designObjects.map((obj) => {
        return new Promise((resolve) => {
          obj.clone((cloned) => resolve(cloned));
        });
      });

      const clonedObjects = await Promise.all(clonePromises);

      clonedObjects.forEach((clonedObj) => {
        clonedObj.set({
          left: clonedObj.left - currentDesignArea.x,
          top: clonedObj.top - currentDesignArea.y,
        });
        tempCanvas.add(clonedObj);
      });

      tempCanvas.renderAll();
      const dataURL = tempCanvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2, // Higher resolution for printing
      });

      if (designFrame) designFrame.set({ visible: true }); // Restore visibility
      currentCanvas.renderAll();
      tempCanvas.dispose();
      return dataURL;
    },
    []
  );

  // Popup-based save handler
  const handleSave = async () => {
    if (!canvas) return;
    if (!selectedProduct || !selectedProduct._id) {
      alert("Vui lòng chọn loại áo hợp lệ trước khi lưu thiết kế!");
      return;
    }
    if (!shirtImage) {
      alert("Ảnh áo chưa được tải. Vui lòng đợi hoặc thử lại.");
      return;
    }

    const allObjects = canvas.getObjects();
    const designElements = allObjects.filter(
      (obj) => !obj.excludeFromExport && obj !== shirtImage
    );

    if (designElements.length === 0) {
      alert("Vui lòng thêm ít nhất một phần tử thiết kế!");
      return;
    }

    // Generate preview image for popup
    const mockupImageBase64 = await generateMockupPreviewBase64(canvas);
    setPendingPreviewImage(mockupImageBase64);
    setShowConfirmPopup(true);
    // Save callback for after confirm
    return new Promise((resolve) => {
      setPendingSaveCallback(() => async (designName) => {
        setShowConfirmPopup(false);
        try {
          const token = localStorage.getItem("token");
        if (!token) {
          alert("Vui lòng đăng nhập để lưu thiết kế!");
          resolve(null);
          navigate(
            `/login?redirect=${encodeURIComponent(
              window.location.pathname + window.location.search
            )}`
          );
          return;
        }
          const cleanDesignImageBase64 = await generateCleanDesignBase64(
            canvas,
            designArea,
            shirtImage
          );

          if (!mockupImageBase64 || !cleanDesignImageBase64) {
            alert("Lỗi khi tạo ảnh thiết kế. Vui lòng thử lại.");
            resolve(null);
            return;
          }

          const designData = {
            version: canvas.version,
            objects: designElements.map((obj) => {
              const objData = obj.toObject();
              objData.left = objData.left - designArea.x;
              objData.top = objData.top - designArea.y;
              return objData;
            }),
            designAreaSize: {
              width: designArea.width,
              height: designArea.height,
            },
          };

          const colorObj = shirtColors.find((c) => c.name === baseColor);

          const designPayload = {
            name: designName || `Thiết kế ${Date.now()}`,
            product: selectedProduct._id,
            colorId: colorObj?._id,
            selectedColor: colorObj,
            selectedSize: "M",
            designData: designData,
            description: `Custom design on ${baseColor} shirt`,
            isPublic: false,
            mockupImageBase64: mockupImageBase64,
            cleanDesignImageBase64: cleanDesignImageBase64,
          };

          const savedDesign = await saveDesign(designPayload, token);
          if (!savedDesign)
            throw new Error(
              "Không nhận được phản hồi từ server khi lưu thiết kế"
            );
          if (!savedDesign._id)
            throw new Error("Thiết kế được lưu nhưng không có ID");

          const designForOrder = {
            _id: savedDesign._id,
            name: savedDesign.name,
            previewImage: savedDesign.previewUrl || mockupImageBase64,
            canvasData: designData,
            product: selectedProduct._id,
            colorId: colorObj?._id,
            selectedColor: colorObj,
            selectedSize: "M",
          };

          alert("Lưu thiết kế thành công!");
          resolve(designForOrder);
        } catch (error) {
          console.error("Lỗi khi lưu thiết kế:", error);
          alert(`Lỗi khi lưu thiết kế: ${error.message}`);
          resolve(null);
        }
      });
    });
  };
  // Handle confirm popup actions
  const handleConfirmPopupClose = () => {
    setShowConfirmPopup(false);
    setPendingSaveCallback(null);
  };

  const handleConfirmPopupConfirm = async (designName) => {
    if (pendingSaveCallback) {
      await pendingSaveCallback(designName);
      setPendingSaveCallback(null);
    }
  };

  const handleAddToCart = async () => {
    if (!canvas || !selectedProduct) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        warning("Vui lòng đăng nhập để thêm vào giỏ hàng!");
        return;
      }

      // First save the design
      const savedDesign = await handleSave();
      if (!savedDesign || !savedDesign._id) {
        alert("Không thể lưu thiết kế. Vui lòng thử lại.");
        return;
      }

      // Get selected color object
      const colorObj = shirtColors.find((c) => c.name === baseColor);

      // Add to cart directly without convertDesignToProduct
      await addToCart(
        {
          product: selectedProduct._id,
          design: savedDesign._id,
          quantity: 1,
          price: selectedProduct.basePrice + 50000, // Add customization fee
          size: "M",
          color: colorObj,
          petType: "dog", // Default to dog, you can add UI to let user select
          customization: {
            size: "M",
            color: colorObj,
            designData: savedDesign.designData,
          },
        },
        token
      );
      success("Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ:", error);
      return;
    }
  };

  const handleOrder = async () => {
    if (!canvas) return;

    try {
      // Save the current design first
      const savedDesign = await handleSave(); // This now returns a simplified design object for orders
      if (!savedDesign || !savedDesign._id) {
        alert("Không thể lưu thiết kế. Vui lòng thử lại.");
        return;
      }

      // Store design data and product id in localStorage for the order page
      localStorage.setItem("designData", JSON.stringify(savedDesign));
      localStorage.setItem("selectedProductId", selectedProduct._id);

      // Navigate to the order page
      navigate("/order");
    } catch (error) {
      console.error("Lỗi khi xử lý đơn hàng:", error);
      alert(`Lỗi khi xử lý đơn hàng: ${error.message}`);
    }
  };

  // In preview thiết kế (để khách hàng xem)
  const handlePrint = () => {
    if (!canvas) return;

    canvas.clone((clonedCanvas) => {
      // Ẩn frame thiết kế
      clonedCanvas.getObjects().forEach((obj) => {
        if (obj.excludeFromExport) {
          obj.visible = false;
        }
      });

      // Xuất ảnh preview (áo + thiết kế)
      const dataURL = clonedCanvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2,
      });

      // Tạo cửa sổ in preview
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Preview Thiết Kế</title>
            <style>
              body { margin: 0; padding: 20px; text-align: center; font-family: Arial; }
              img { max-width: 100%; height: auto; border: 1px solid #ddd; }
              .note { color: #666; margin-top: 10px; font-size: 14px; }
              @media print {
                body { margin: 0; padding: 0; }
                .note { display: none; }
              }
            </style>
          </head>
          <body>
            <h2>Preview Thiết Kế Áo Thú Cưng</h2>
            <img src="${dataURL}" alt="Design Preview" />
            <div class="note">
              * Đây là hình ảnh preview. Sản phẩm thực tế sẽ được shop in theo thiết kế của bạn.
            </div>
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    });
  };

  // Tải xuống CHỈ PHẦN THIẾT KẾ (nền trong suốt, không có khung)
  const handleDownloadCleanDesign = async () => {
    if (!canvas || !designArea || !shirtImage) {
      alert("Canvas, vùng thiết kế hoặc ảnh áo chưa sẵn sàng.");
      return;
    }
    try {
      const dataURL = await generateCleanDesignBase64(
        canvas,
        designArea,
        shirtImage
      );
      if (dataURL) {
        const link = document.createElement("a");
        link.download = `thiet-ke-in-an_${Date.now()}.png`;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("✅ Đã tải xuống file thiết kế sạch!");
      } else {
        alert("Chưa có thiết kế để tải xuống hoặc lỗi khi tạo ảnh.");
      }
    } catch (error) {
      console.error("Lỗi khi tải xuống thiết kế sạch:", error);
      alert("Lỗi khi tải xuống thiết kế. Vui lòng thử lại.");
    }
  };

  // Đặt hàm này bên trong component Design của cậu
  // This function `exportCleanDesignForPrint` is now replaced by `generateCleanDesignBase64`
  // and `handleDownloadCleanDesign` handles the download action.
  // const exportCleanDesignForPrint = async () => { ... } // This can be removed

  return (
    <div className="design-page">
      <Navbar />

      <div className="design-container fade-in-up">
        {/* Left Toolbar */}
        <div className="toolbar-wrapper">
          <div className="toolbar">
            <div className="toolbar-header">
              <h3>
                <i className="fas fa-palette"></i> Studio Thiết Kế
              </h3>
            </div>
            <div className="toolbar-content">
              <LeftToolbar
                clothingType={clothingType}
                setClothingType={setClothingType}
                products={products}
                shirtColors={shirtColors}
                baseColor={baseColor}
                setBaseColor={setBaseColor}
                addText={addText}
                handleImageUpload={handleImageUpload}
                selectedTool={selectedTool}
                setSelectedTool={setSelectedTool}
                deleteSelected={deleteSelected}
                clearDesign={clearDesign}
              />
            </div>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="canvas-container">
          <div className="canvas-header">
            <h4 className="canvas-title">
              <i className="fas fa-tshirt"></i>
              Khu Vực Thiết Kế
            </h4>
            <div className="canvas-actions">
              <button
                className="canvas-action-btn"
                onClick={() =>
                  canvas && canvas.getActiveObject() && deleteSelected()
                }
                title="Xóa đối tượng đã chọn"
              >
                <i className="fas fa-trash"></i>
              </button>
              <button
                className="canvas-action-btn"
                onClick={clearDesign}
                title="Xóa toàn bộ thiết kế"
              >
                <i className="fas fa-eraser"></i>
              </button>
            </div>
          </div>
          <div className="canvas-wrapper">
            <CanvasContainer canvasRef={canvasRef} />

            {/* Add the Context Menu */}
            <ContextMenu
              show={contextMenu.show}
              position={contextMenu.position}
              onClose={() =>
                setContextMenu((prev) => ({ ...prev, show: false }))
              }
              onChangeColor={handleContextColorChange}
              onChangeFont={handleContextFontChange}
              onDelete={handleContextDelete}
              isTextObject={contextMenu.isTextObject}
              availableFonts={availableFonts} // ContextMenu still needs this
              currentFontFamily={currentFontFamily} // ContextMenu still needs this
              currentTextColor={currentTextColor} // ContextMenu still needs this
            />
          </div>
        </div>

        {/* Right Toolbar */}
        <div className="right-toolbar">
          <div className="right-toolbar-header">
            <h3>
              <i className="fas fa-rocket"></i> Hành Động
            </h3>
          </div>
          <div className="right-toolbar-content">
            <RightToolbar
              handleSave={handleSave}
              handleAddToCart={handleAddToCart}
              handleOrder={handleOrder}
              handlePrint={handlePrint}
              handleDownload={handleDownloadCleanDesign}
            />
          </div>
        </div>
      </div>

      {/* Confirm Design Popup */}
      <ConfirmDesignPopup
        isOpen={showConfirmPopup}
        onClose={handleConfirmPopupClose}
        onConfirm={handleConfirmPopupConfirm}
        previewImage={pendingPreviewImage}
      />
    </div>
  );
}

export default Design;
