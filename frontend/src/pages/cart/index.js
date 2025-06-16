import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import "./Cart.css";
import {
  getCart,
  removeItemFromCart,
  updateItemQuantity,
  updateCartItem,
  addToCart, // Thêm import addToCart từ service
} from "../../services/cart";
import { fetchProductById } from "../../services/products";
import {
  CartHeader,
  CartItem,
  CartActions,
  EmptyCart,
  LoadingState,
  ErrorState,
  OrderSummary,
} from "../../components/cart";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee] = useState(30000);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableSizes] = useState(["S", "M", "L", "XL", "Big Size"]); // Danh sách size có sẵn
  const [editingSizeItem, setEditingSizeItem] = useState(null); // Item đang chỉnh sửa size
  const [editingPetTypeItem, setEditingPetTypeItem] = useState(null); // Item đang chỉnh sửa pet type
  const [editingColorItem, setEditingColorItem] = useState(null); // Item đang chỉnh sửa color
  const [addingSizeItemId, setAddingSizeItemId] = useState(null); // State để theo dõi item đang thêm size

  // Function to enrich cart items with full product details
  const enrichCartItemsWithProductDetails = async (cartItems) => {
    const enrichedItems = await Promise.all(
      cartItems.map(async (item) => {
        try {
          // If product has no colors or is missing details, fetch from API
          if (
            item.product &&
            item.product.id &&
            (!item.product.colors || item.product.colors.length === 0)
          ) {
            console.log(
              `Fetching full product details for: ${item.product.id}`
            );
            const fullProduct = await fetchProductById(item.product.id);

            return {
              ...item,
              product: {
                ...item.product,
                colors: fullProduct.colors || [],
                sizes: fullProduct.sizes || item.product.sizes || [],
                // Keep other enriched data
              },
            };
          }
          return item;
        } catch (error) {
          console.error(
            `Failed to fetch product details for ${item.product?.id}:`,
            error
          );
          return item; // Return item as-is if fetch fails
        }
      })
    );

    return enrichedItems;
  };

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const cartData = await getCart(token);

      // Backend now calculates all prices based on size + design fee
      const rawItems = cartData.items || [];
      const backendSubtotal =
        typeof cartData.total === "number" ? cartData.total : 0;

      // Process items with new pricing structure
      const processedItems = rawItems.map((item) => {
        // Backend calculates unitPrice based on selected size + design fee (if applicable)
        const unitPrice = item.unitPrice || 0; // Backend provides calculated price
        const totalItemPrice =
          item.totalPrice || unitPrice * item.quantity || 0;

        // Lấy thông tin về màu sắc từ selected color hoặc color
        const selectedColor = item.selectedColor || {};
        const colorInfo = {
          name: selectedColor.name || item.color?.name || "",
          hexCode: selectedColor.hexCode || item.color?.hexCode || "#000000",
        };

        // Lấy kích thước đã chọn
        const size = item.selectedSize || item.size || "";

        // Lấy loại thú cưng đã chọn
        const petType = item.petType || "dog"; // Default to dog
        const petTypeDisplay = petType === "dog" ? "Chó" : "Mèo";

        // Lấy weight range
        const weightRange = item.weightRange || "";

        // Thông tin về sản phẩm
        let productInfo = {};
        if (item.product) {
          productInfo = {
            id: item.product._id || "",
            name: item.product.name || "Sản phẩm",
            description: item.product.description || "",
            imageUrl: item.product.mockupImageUrl || "",
            // Remove basePrice reference since it's now per-size
            category: item.product.category || "",
            sizes: item.product.sizes || [], // Include sizes array for price lookup
            colors: item.product.colors || [], // Include colors array
            designFee: item.product.designFee || 80000,
          };
        }

        // Thông tin về thiết kế tùy chỉnh
        let designInfo = null;
        if (item.design) {
          designInfo = {
            id: item.design._id || item.design.colorId || "",
            name: item.design.name || "Thiết kế tùy chỉnh",
            description: item.design.description || "",
            previewImage: item.design.previewImage || "",
            printDesignImage: item.design.printDesignImage || "",
            calculatedPrice: item.design.calculatedPrice || 0, // Pre-calculated design price
            isPublic: item.design.isPublic || false,
          };
        }

        return {
          ...item,
          _id: item._id || "", // Đảm bảo có ID cho mỗi item
          price: unitPrice, // Use backend-calculated price
          totalPrice: totalItemPrice,
          quantity: item.quantity || 1,
          product: productInfo,
          design: designInfo,
          color: colorInfo,
          size: size,
          petType: petType,
          petTypeDisplay: petTypeDisplay,
          weightRange: weightRange,
          baseCost: item.baseCost || 0,
          designFee: item.designFee || 0,
          status: item.status || "active",
        };
      });

      // Enrich cart items with full product details (including colors)
      const enrichedItems = await enrichCartItemsWithProductDetails(
        processedItems
      );

      setCartItems(enrichedItems);
      setSubtotal(backendSubtotal);
      setTotal(backendSubtotal + shippingFee);
      setError(null);
    } catch (err) {
      setError("Không thể tải giỏ hàng. Vui lòng thử lại sau.");
      console.error("Error fetching cart:", err);
      setCartItems([]);
      setSubtotal(0);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [shippingFee]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveItem = async (itemId) => {
    // Lưu trạng thái hiện tại để rollback nếu có lỗi
    const originalCartItems = [...cartItems];
    const originalSubtotal = subtotal;
    const originalTotal = total;

    try {
      // Cập nhật UI trước (optimistic update)
      const updatedCartItems = cartItems.filter((item) => item._id !== itemId);
      setCartItems(updatedCartItems);

      // Tính lại tổng tiền
      const newSubtotal = updatedCartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setSubtotal(newSubtotal);
      setTotal(newSubtotal + shippingFee);

      // Gọi API xóa item
      const token = localStorage.getItem("token");
      const response = await removeItemFromCart(itemId, token);

      // Nếu có lỗi khi response không thành công
      if (!response) {
        throw new Error("Failed to remove item");
      }

      // Không cần fetch lại toàn bộ giỏ hàng vì UI đã được cập nhật
    } catch (err) {
      setError("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
      console.error("Error removing item:", err);

      // Rollback UI nếu có lỗi
      setCartItems(originalCartItems);
      setSubtotal(originalSubtotal);
      setTotal(originalTotal);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    // Store original cart items for rollback
    const originalCartItems = [...cartItems];
    const originalSubtotal = subtotal;
    const originalTotal = total;

    try {
      const token = localStorage.getItem("token");

      // Find current item to get its unit price
      const currentItem = cartItems.find((item) => item._id === itemId);
      const unitPrice = currentItem?.price || 0;

      // Optimistically update UI
      const updatedCartItems = cartItems.map((item) =>
        item._id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: unitPrice * newQuantity,
            }
          : item
      );
      setCartItems(updatedCartItems);

      // Recalculate totals
      const newSubtotal = updatedCartItems.reduce(
        (acc, item) => acc + (item.totalPrice || item.price * item.quantity),
        0
      );
      setSubtotal(newSubtotal);
      setTotal(newSubtotal + shippingFee);

      await updateItemQuantity(itemId, newQuantity, token);
    } catch (err) {
      setError("Không thể cập nhật số lượng. Vui lòng thử lại sau.");
      console.error("Error updating quantity:", err);
      // Rollback
      setCartItems(originalCartItems);
      setSubtotal(originalSubtotal);
      setTotal(originalTotal);
    }
  };

  // Hàm xử lý khi người dùng mở menu chọn size
  const handleOpenSizeSelector = (itemId) => {
    setEditingSizeItem(itemId);
  };

  // Hàm xử lý khi người dùng mở menu chọn pet type
  const handleOpenPetTypeSelector = (itemId) => {
    setEditingPetTypeItem(itemId);
  };

  // Hàm xử lý khi người dùng mở menu chọn color
  const handleOpenColorSelector = (itemId) => {
    console.log("Opening color selector for item:", itemId);
    const item = cartItems.find((item) => item._id === itemId);
    console.log("Item found:", item);
    console.log("Item product:", item?.product);
    console.log("Available colors:", item?.product?.colors);
    console.log("Colors length:", item?.product?.colors?.length);

    // Close other dropdowns first
    setEditingSizeItem(null);
    setEditingPetTypeItem(null);

    setEditingColorItem(itemId);
  };

  // Hàm xử lý khi người dùng chọn pet type mới
  const handlePetTypeChange = async (itemId, newPetType) => {
    if (!newPetType || !["cat", "dog"].includes(newPetType)) return;

    const originalCartItems = [...cartItems];
    const originalSubtotal = subtotal;
    const originalTotal = total;

    try {
      const token = localStorage.getItem("token");

      // Update UI optimistically
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === itemId) {
          return {
            ...item,
            petType: newPetType,
            petTypeDisplay: newPetType === "dog" ? "Chó" : "Mèo",
          };
        }
        return item;
      });
      setCartItems(updatedCartItems);

      // Call API to update pet type - backend will recalculate price
      const response = await updateCartItem(
        itemId,
        { petType: newPetType },
        token
      );
      setEditingPetTypeItem(null);

      // Process response and update cart
      if (response && response.items) {
        await processCartResponse(response);
        setError(null);
      }
    } catch (err) {
      console.error("Error updating pet type:", err);
      setError("Không thể cập nhật loại thú cưng. Vui lòng thử lại sau.");
      // Rollback to original state
      setCartItems(originalCartItems);
      setSubtotal(originalSubtotal);
      setTotal(originalTotal);
    }
  };

  // Hàm xử lý khi người dùng chọn color mới
  const handleColorChange = async (itemId, newColor) => {
    console.log("handleColorChange called:", { itemId, newColor });

    if (!newColor) {
      console.log("No new color provided");
      return;
    }

    const originalCartItems = [...cartItems];

    try {
      // Update UI optimistically (color doesn't affect price, so no API call needed for price)
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === itemId) {
          console.log(
            "Updating item color:",
            item._id,
            "from",
            item.color,
            "to",
            newColor
          );
          return {
            ...item,
            color: newColor,
          };
        }
        return item;
      });

      setCartItems(updatedCartItems);

      // Close dropdown after a short delay to let user see the change
      setTimeout(() => {
        setEditingColorItem(null);
      }, 150);

      // Save color change to backend if needed
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await updateCartItem(itemId, { selectedColor: newColor }, token);
          console.log("Color update saved to backend");
        }
      } catch (apiError) {
        console.warn("Failed to save color to backend:", apiError);
        // Don't throw error as UI update is more important than backend sync for colors
      }

      setError(null);
    } catch (err) {
      console.error("Error updating color:", err);
      setError("Không thể cập nhật màu sắc. Vui lòng thử lại sau.");
      // Rollback to original state
      setCartItems(originalCartItems);
      setEditingColorItem(null);
    }
  };

  // Helper function to process cart response
  const processCartResponse = async (response) => {
    const processedItems = response.items.map((apiItem) => {
      const unitPrice = apiItem.unitPrice || 0;
      const totalItemPrice =
        apiItem.totalPrice || unitPrice * apiItem.quantity || 0;

      const selectedColor = apiItem.selectedColor || {};
      const colorInfo = {
        name: selectedColor.name || apiItem.color?.name || "",
        hexCode: selectedColor.hexCode || apiItem.color?.hexCode || "#000000",
      };

      const size = apiItem.selectedSize || apiItem.size || "";
      const petType = apiItem.petType || "dog";
      const petTypeDisplay = petType === "dog" ? "Chó" : "Mèo";
      const weightRange = apiItem.weightRange || "";

      let productInfo = {};
      if (apiItem.product) {
        productInfo = {
          id: apiItem.product._id || "",
          name: apiItem.product.name || "Sản phẩm",
          description: apiItem.product.description || "",
          imageUrl: apiItem.product.mockupImageUrl || "",
          category: apiItem.product.category || "",
          sizes: apiItem.product.sizes || [],
          colors: apiItem.product.colors || [],
          designFee: apiItem.product.designFee || 80000,
        };
      }

      let designInfo = null;
      if (apiItem.design) {
        designInfo = {
          id: apiItem.design._id || apiItem.design.colorId || "",
          name: apiItem.design.name || "Thiết kế tùy chỉnh",
          description: apiItem.design.description || "",
          previewImage: apiItem.design.previewImage || "",
          printDesignImage: apiItem.design.printDesignImage || "",
          calculatedPrice: apiItem.design.calculatedPrice || 0,
          isPublic: apiItem.design.isPublic || false,
        };
      }

      return {
        ...apiItem,
        _id: apiItem._id || "",
        price: unitPrice,
        totalPrice: totalItemPrice,
        quantity: apiItem.quantity || 1,
        product: productInfo,
        design: designInfo,
        color: colorInfo,
        size: size,
        petType: petType,
        petTypeDisplay: petTypeDisplay,
        weightRange: weightRange,
        baseCost: apiItem.baseCost || 0,
        designFee: apiItem.designFee || 0,
        status: apiItem.status || "active",
      };
    });

    // Update cart state with new items (enrich with product details)
    const enrichedItems = await enrichCartItemsWithProductDetails(
      processedItems
    );
    setCartItems(enrichedItems);

    // Update totals
    const newSubtotal =
      typeof response.total === "number"
        ? response.total
        : processedItems.reduce(
            (acc, item) =>
              acc + (item.totalPrice || item.price * item.quantity),
            0
          );

    setSubtotal(newSubtotal);
    setTotal(newSubtotal + shippingFee);
  };

  // Hàm xử lý khi người dùng chọn size mới
  const handleSizeChange = async (itemId, newSize) => {
    if (!newSize) return;

    const originalCartItems = [...cartItems];
    const originalSubtotal = subtotal;
    const originalTotal = total;

    try {
      const token = localStorage.getItem("token");

      // Update UI optimistically
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === itemId) {
          return { ...item, size: newSize };
        }
        return item;
      });
      setCartItems(updatedCartItems);

      // Call API to update size - backend will recalculate price
      const response = await updateCartItem(itemId, { size: newSize }, token);
      setEditingSizeItem(null);

      // Process response and update cart
      if (response && response.items) {
        await processCartResponse(response);
        setError(null);
      }
    } catch (err) {
      console.error("Error updating size:", err);
      setError("Không thể cập nhật kích thước. Vui lòng thử lại sau.");
      // Rollback to original state
      setCartItems(originalCartItems);
      setSubtotal(originalSubtotal);
      setTotal(originalTotal);
    }
  };

  // Hàm xử lý khi người dùng muốn thêm sản phẩm với size khác
  const handleAddSameProductDifferentSize = async (item, newSize) => {
    try {
      const token = localStorage.getItem("token");

      if (!item.product?._id && !item.product?.id) {
        console.error(
          "Cannot add item with different size: Missing product ID"
        );
        setError("Không thể thêm sản phẩm. Thiếu thông tin sản phẩm.");
        return;
      }

      setAddingSizeItemId(item._id);

      // Create new item data - backend will calculate price based on size and pet type
      const newItemData = {
        product: item.product?._id || item.product?.id,
        design: item.design?._id || item.design?.id,
        quantity: 1,
        size: newSize,
        petType: item.petType || "dog",
        color: item.color,
        customization: item.customization,
      };

      // Add to cart - backend calculates price and returns updated cart
      const response = await addToCart(newItemData, token);

      // Process response and update cart
      if (response && response.items) {
        await processCartResponse(response);
        setError(null);
      }

      // Close the size dropdown
      setEditingSizeItem(null);
    } catch (err) {
      console.error("Error adding product with different size:", err);
      setError("Không thể thêm sản phẩm. Vui lòng thử lại sau.");
    } finally {
      setAddingSizeItemId(null);
    }
  };

  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value);
  };

  const handleApplyPromo = () => {
    // Implement promo code logic here
    alert("Tính năng mã khuyến mãi sẽ sớm có!");
  };

  const handleCheckout = () => {
    // Navigate to order page with fromCart flag
    console.log("Navigating to order page with fromCart=true");
    navigate("/order", { state: { fromCart: true } });
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="cart-page">
          <LoadingState />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="cart-page">
          <ErrorState error={error} onRetry={fetchCart} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="cart-page">
        <div className="cart-container">
          {/* Cart Header */}
          <CartHeader itemCount={cartItems.length} />

          {/* Left Section - Cart Items */}
          <div className="cart-items-section">
            {cartItems.length === 0 ? (
              <EmptyCart onContinueShopping={handleContinueShopping} />
            ) : (
              <>
                <div className="cart-items-header">
                  <h2>Sản phẩm trong giỏ</h2>
                  <span className="items-count">
                    {cartItems.length} sản phẩm
                  </span>
                </div>
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item._id}
                      item={item}
                      availableSizes={availableSizes}
                      editingSizeItem={editingSizeItem}
                      editingPetTypeItem={editingPetTypeItem}
                      editingColorItem={editingColorItem}
                      addingSizeItemId={addingSizeItemId}
                      onOpenSizeSelector={handleOpenSizeSelector}
                      onCloseSizeSelector={() => setEditingSizeItem(null)}
                      onOpenPetTypeSelector={handleOpenPetTypeSelector}
                      onClosePetTypeSelector={() => setEditingPetTypeItem(null)}
                      onOpenColorSelector={handleOpenColorSelector}
                      onCloseColorSelector={() => setEditingColorItem(null)}
                      onSizeChange={handleSizeChange}
                      onPetTypeChange={handlePetTypeChange}
                      onColorChange={handleColorChange}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemoveItem={handleRemoveItem}
                      onAddSameProductDifferentSize={
                        handleAddSameProductDifferentSize
                      }
                    />
                  ))}
                </div>

                <CartActions onContinueShopping={handleContinueShopping} />
              </>
            )}
          </div>

          {/* Right Section - Order Summary */}
          {cartItems.length > 0 && (
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shippingFee={shippingFee}
              total={total}
              promoCode={promoCode}
              onPromoCodeChange={handlePromoCodeChange}
              onApplyPromo={handleApplyPromo}
              onCheckout={handleCheckout}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
