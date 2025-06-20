import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import { createOrder, updateOrderPayment } from "../../services/orders";
import { createPayOSOrder } from "../../services/payment";
import { fetchProductById } from "../../services/products";
import { getCart } from "../../services/cart";
import { getUserAddresses, addUserAddress } from "../../services/users";
import { FiPlusCircle } from "react-icons/fi";
import { BsCashStack, BsBank } from "react-icons/bs";
import "./Order.css";

import { useSearchParams } from "react-router-dom";
import { useToastContext } from "../../contexts/ToastContext";

function Order() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [designData, setDesignData] = useState(null);
  const [productData, setProductData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isFromCart, setIsFromCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    phone: "",
    street: "",
    ward: "",
    district: "",
    city: "",
  });

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pricingInfo, setPricingInfo] = useState({
    subtotal: 0,
    shippingFee: 0,
    tax: 0,
    discount: 0,
    total: 0,
  });

  const { success, error: toastError, warning } = useToastContext();

  // Xử lý redirect sau khi thanh toán PayOS
  useEffect(() => {
    const id = searchParams.get("id");
    const status = searchParams.get("status");
    const success = searchParams.get("success");
    const cancel = searchParams.get("cancel");
    // Nếu có id và status là PAID, chuyển về order-details
    if (
      id &&
      status &&
      status.toUpperCase() === "PAID" &&
      success === "1" &&
      cancel !== "true"
    ) {
      navigate(`/order-details/${id}`);
    } else if (
      searchParams.has("success") ||
      searchParams.has("status") ||
      searchParams.has("cancel")
    ) {
      // Nếu có các query liên quan nhưng không hợp lệ, chuyển về trang lỗi
      navigate("/payment-error");
    }
    // Nếu không có query params, không làm gì (giữ nguyên trang đặt hàng)
  }, [searchParams, navigate]);

  // Function to safely access nested properties
  const safeAccess = (obj, path, defaultValue = null) => {
    try {
      const value = path.split(".").reduce((o, p) => (o || {})[p], obj);
      return value !== undefined && value !== null ? value : defaultValue;
    } catch (err) {
      return defaultValue;
    }
  };

  // Fetch user's saved addresses
  const fetchUserAddresses = async () => {
    try {
      const addresses = await getUserAddresses();
      setSavedAddresses(addresses);
      console.log(addresses);

      // If user has addresses, select the default one automatically
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress._id);
        // Pre-fill the delivery form with the default address
        setDeliveryInfo({
          name: defaultAddress.name,
          phone: defaultAddress.phone,
          street: defaultAddress.street,
          ward: defaultAddress.ward || "",
          district: defaultAddress.district,
          city: defaultAddress.city,
        });
      } else if (addresses.length > 0) {
        // If no default address, select the first one
        setSelectedAddressId(addresses[0]._id);
        setDeliveryInfo({
          name: addresses[0].name,
          phone: addresses[0].phone,
          street: addresses[0].street,
          ward: addresses[0].ward || "",
          district: addresses[0].district,
          city: addresses[0].city,
        });
      } else {
        // No saved addresses, set flag to show new address form
        console.log("No saved addresses found, showing new address form");
        setIsAddingNewAddress(true);
      }
    } catch (error) {
      console.error("Error fetching user addresses:", error);
    }
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Check if coming from cart or direct design order
        const fromCart = location.state?.fromCart || false;
        setIsFromCart(fromCart);

        if (fromCart) {
          // Get cart data
          const token = localStorage.getItem("token");
          // if (!token) {
          //   setError("Vui lòng đăng nhập để tiếp tục");
          //   setIsLoading(false);
          //   return;
          // }

          try {
            const cartData = await getCart(token);

            if (!cartData || !cartData.items || cartData.items.length === 0) {
              setError("Giỏ hàng của bạn đang trống");
              setIsLoading(false);
              return;
            }

            // Process and standardize cart items for consistent rendering
            const processedItems = cartData.items.map((item) => {
              // Extract product info
              const product = item.product || {};

              // Extract design info
              const design = item.design || null;

              // Handle price calculations - Fixed to use proper structure
              let unitPrice = item.unitPrice || 0;

              // If unitPrice is not available, try to calculate from product
              if (!unitPrice && product.sizes && item.size) {
                const sizeInfo = product.sizes.find(
                  (s) => s.name === item.size
                );
                if (sizeInfo && sizeInfo.baseCost) {
                  // Default to dog if petType not specified
                  const petType = item.petType || "dog";
                  unitPrice =
                    sizeInfo.baseCost[petType] || sizeInfo.baseCost.dog || 0;

                  // Add design fee if it's a custom design
                  if (design && product.designFee) {
                    unitPrice += product.designFee;
                  }
                }
              }

              // Fallback to basePrice if still no price found
              if (!unitPrice) {
                unitPrice = product.basePrice || 0;
              }

              const quantity = item.quantity || 1;
              const totalPrice = item.totalPrice || unitPrice * quantity;

              // Handle size and color
              const size = item.selectedSize || item.size || "M";
              const colorInfo = item.selectedColor ||
                item.color || {
                  name: "Mặc định",
                  hexCode: "#000000",
                };

              // Image URLs
              const imageUrl =
                design?.previewImage ||
                product.imageUrl ||
                product.mockupImageUrl ||
                "";

              // Return standardized item
              return {
                ...item,
                product,
                design,
                quantity,
                unitPrice,
                totalPrice,
                size,
                colorInfo,
                imageUrl,
              };
            });

            setCartItems(processedItems);

            // Calculate pricing from cart
            const subtotal = processedItems.reduce(
              (sum, item) => sum + item.totalPrice,
              0
            );
            const shippingFee = 30000; // Fixed shipping fee
            const tax = Math.round(subtotal * 0.1); // 10% tax
            // --- ADD THIS FOR TESTING DISCOUNT ---
            const discount = 0;
            const total = Math.max(subtotal + shippingFee + tax - discount, 0);

            setPricingInfo({
              subtotal,
              shippingFee,
              tax,
              discount,
              total,
            });
          } catch (cartError) {
            console.error("Error loading cart data:", cartError);
            setError("Không thể tải dữ liệu giỏ hàng");
            setIsLoading(false);
            return;
          }
        } else {
          // Get design data from localStorage or location state
          const savedDesign = localStorage.getItem("designData");
          if (savedDesign) {
            const design = JSON.parse(savedDesign);
            setDesignData(design);
          } else if (location.state?.design) {
            setDesignData(location.state.design);
          }

          // Get product data
          const savedProductId = localStorage.getItem("selectedProductId");
          if (savedProductId) {
            try {
              // Fetch product data from API instead of relying on localStorage
              const product = await fetchProductById(savedProductId);
              setProductData(product);

              // Calculate pricing - Fixed for proper product structure
              let subtotal = 0;
              if (product.sizes && product.selectedSize) {
                const sizeInfo = product.sizes.find(
                  (s) => s.name === product.selectedSize
                );
                if (sizeInfo && sizeInfo.baseCost) {
                  const petType = product.selectedPetType || "dog";
                  subtotal =
                    sizeInfo.baseCost[petType] || sizeInfo.baseCost.dog || 0;

                  // Add design fee if it's customizable
                  if (product.isCustomizable && product.designFee) {
                    subtotal += product.designFee;
                  }
                }
              }

              // Fallback to stored price if calculation fails
              if (!subtotal) {
                subtotal = product.price || product.basePrice || 0;
              }
              const shippingFee = 30000; // Fixed shipping fee
              const tax = Math.round(subtotal * 0.1); // 10% tax
              // --- ADD THIS FOR TESTING DISCOUNT ---
              const discount = 0;
              const total = Math.max(
                subtotal + shippingFee + tax - discount,
                0
              );

              setPricingInfo({
                subtotal,
                shippingFee,
                tax,
                discount,
                total,
              });
            } catch (err) {
              console.error("Error fetching product data:", err);
              setError("Không thể tải thông tin sản phẩm");
            }
          } else {
            setError("Không tìm thấy thông tin sản phẩm");
          }
        }

        // Fetch user's saved addresses
        fetchUserAddresses();
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [location.state]);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSelect = (addressId) => {
    // If user selects "Add new address"
    if (addressId === "new") {
      setIsAddingNewAddress(true);
      setSelectedAddressId(null);
      // Clear the delivery form
      setDeliveryInfo({
        name: "",
        phone: "",
        street: "",
        ward: "",
        district: "",
        city: "",
      });
      return;
    }

    // Find the selected address from saved addresses
    const selectedAddress = savedAddresses.find(
      (addr) => addr._id === addressId
    );
    if (selectedAddress) {
      setSelectedAddressId(addressId);
      setIsAddingNewAddress(false);
      // Fill the delivery form with the selected address
      setDeliveryInfo({
        name: selectedAddress.name,
        phone: selectedAddress.phone,
        street: selectedAddress.street,
        ward: selectedAddress.ward || "",
        district: selectedAddress.district,
        city: selectedAddress.city,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validate required fields

    if (
      !deliveryInfo.name ||
      !deliveryInfo.phone ||
      !deliveryInfo.street ||
      !deliveryInfo.district ||
      !deliveryInfo.city
    ) {
      toastError("Vui lòng điền đầy đủ thông tin giao hàng");
      setIsLoading(false);
      return;
    }

    if (!paymentMethod) {
      toastError("Vui lòng chọn phương thức thanh toán");
      setIsLoading(false);
      return;
    }

    try {
      // If adding a new address and the checkbox is checked, save it to user profile
      if (isAddingNewAddress && saveAddressToProfile) {
        try {
          await addUserAddress({
            name: deliveryInfo.name,
            phone: deliveryInfo.phone,
            street: deliveryInfo.street,
            ward: deliveryInfo.ward,
            district: deliveryInfo.district,
            city: deliveryInfo.city,
            isDefault: savedAddresses.length === 0, // Set as default if it's the first address
          });
        } catch (addressError) {
          console.error("Error saving address to profile:", addressError);
          // Continue with order creation even if address saving fails
        }
      }

      // Prepare order data based on whether it's from cart or direct design
      let orderItems = [];

      if (isFromCart) {
        // Process cart items using our safeAccess helper
        orderItems = cartItems.map((item) => {
          // Use safeAccess to get properties safely
          const productId = safeAccess(
            item,
            "product._id",
            safeAccess(item, "product", safeAccess(item, "productId"))
          );
          const designId = safeAccess(
            item,
            "design._id",
            safeAccess(item, "design", safeAccess(item, "designId"))
          );
          const productName = safeAccess(item, "product.name", "Sản phẩm");
          const colorName = safeAccess(
            item,
            "colorInfo.name",
            safeAccess(
              item,
              "color.name",
              safeAccess(item, "selectedColor.name", "Mặc định")
            )
          );
          const colorHex = safeAccess(
            item,
            "colorInfo.hexCode",
            safeAccess(
              item,
              "color.hexCode",
              safeAccess(item, "selectedColor.hexCode", "#000000")
            )
          );
          const size = safeAccess(
            item,
            "size",
            safeAccess(item, "selectedSize", "M")
          );
          const quantity = safeAccess(item, "quantity", 1);
          const unitPrice = safeAccess(
            item,
            "unitPrice",
            safeAccess(item, "product.basePrice", 0)
          );
          const totalPrice = safeAccess(
            item,
            "totalPrice",
            unitPrice * quantity
          );

          // Prepare design snapshot if available
          let designSnapshot = null;
          if (safeAccess(item, "design")) {
            const designData = safeAccess(
              item,
              "design.designData",
              safeAccess(item, "design.canvasData")
            );
            const previewImage = safeAccess(
              item,
              "design.previewImage",
              safeAccess(
                item,
                "design.mockupImageUrl",
                safeAccess(item, "imageUrl", "")
              )
            );

            if (designData || previewImage) {
              designSnapshot = {
                canvasData:
                  typeof designData === "string"
                    ? designData
                    : JSON.stringify(designData || {}),
                previewImage: previewImage || "",
              };
            }
          }

          // Return the formatted order item with petType
          return {
            product: productId,
            design: designId,
            productName: productName,
            colorName: colorName,
            colorHex: colorHex,
            size: size,
            petType: safeAccess(item, "petType", "dog"), // Add petType for backend
            quantity: quantity,
            unitPrice: unitPrice,
            totalPrice: totalPrice,
            designSnapshot: designSnapshot,
          };
        });
      } else if (designData && productData) {
        // Single product with design - improved handling for color and pricing
        const colorHex =
          productData.color?.hex || productData.color?.hexCode || "#000000";

        // Calculate proper unit price
        let unitPrice = 0;
        if (productData.sizes && productData.selectedSize) {
          const sizeInfo = productData.sizes.find(
            (s) => s.name === productData.selectedSize
          );
          if (sizeInfo && sizeInfo.baseCost) {
            const petType = productData.selectedPetType || "dog";
            unitPrice =
              sizeInfo.baseCost[petType] || sizeInfo.baseCost.dog || 0;

            // Add design fee if it's customizable
            if (productData.isCustomizable && productData.designFee) {
              unitPrice += productData.designFee;
            }
          }
        }

        // Fallback to stored price if calculation fails
        if (!unitPrice) {
          unitPrice = productData.price || productData.basePrice || 0;
        }

        orderItems = [
          {
            design: designData._id,
            product: productData._id,
            productName: productData.name,
            colorName: productData.color?.name || "Mặc định",
            colorHex: colorHex,
            size: productData.size || "M",
            petType: productData.selectedPetType || "dog", // Add petType
            quantity: 1,
            unitPrice: unitPrice, // Use calculated unitPrice
            totalPrice: unitPrice, // Use calculated unitPrice
            designSnapshot: {
              canvasData:
                typeof designData.canvasData === "string"
                  ? designData.canvasData
                  : JSON.stringify(designData.canvasData || {}),
              previewImage: designData.previewImage || "",
            },
          },
        ];
      } else {
        throw new Error("Không có thông tin sản phẩm để đặt hàng");
      }

      // Prepare final order data to match the database schema
      const orderData = {
        shippingAddress: {
          name: deliveryInfo.name,
          phone: deliveryInfo.phone,
          street: deliveryInfo.street,
          ward: deliveryInfo.ward || "",
          district: deliveryInfo.district,
          city: deliveryInfo.city,
        },
        items: orderItems,
        pricing: {
          subtotal: pricingInfo.subtotal,
          shippingFee: pricingInfo.shippingFee,
          tax: pricingInfo.tax,
          discount: pricingInfo.discount,
          total: pricingInfo.total,
        },
        payment: {
          method: paymentMethod,
          status: paymentMethod === "cod" ? "pending" : "processing",
        },
      };

      try {
        // Create the order
        const createdOrder = await createOrder(orderData);

        // For cash on delivery, we're done
        if (paymentMethod === "cod") {
          success("Đặt hàng thành công!");
          // Clean up localStorage
          if (!isFromCart) {
            localStorage.removeItem("designData");
            localStorage.removeItem("selectedProductId");
          }
          navigate(`/order-details/${createdOrder._id}`);
          return;
        }

        // PayOS bank payment
        if (paymentMethod === "bank") {
          try {
            //       orderCode: orderNumber, // Use the extracted numeric part of orderCode
            // amount,
            // description: description, // Use the original description from request
            // cancelUrl,
            // returnUrl,
            // expiredAt,
            // Gọi API tạo link thanh toán PayOS
            const payosRes = await createPayOSOrder({
              orderNumber: createdOrder.orderNumber,
              amount: pricingInfo.total,
              description: `${createdOrder.orderNumber}`,

              cancelUrl: `${window.location.origin}/payment-error`,
              returnUrl: `${window.location.origin}/order-details/${createdOrder._id}`,
              expiredAt: Math.floor(Date.now() / 1000) + 3600, // 1h
            });
            console.log(payosRes);
            if (payosRes && payosRes.data && payosRes.data.checkoutUrl) {
              // Điều hướng sang trang PayOS
              navigate("/order/payos", {
                state: {
                  payUrl: payosRes.data.checkoutUrl,
                  orderId: createdOrder._id,
                },
              });
              return;
            } else {
              throw new Error("Không lấy được link thanh toán PayOS");
            }
          } catch (err) {
            setError(err.message || "Không tạo được link thanh toán PayOS");
            setIsLoading(false);
            return;
          }
        }

        // For other payment methods, handle payment
        // This is a placeholder for payment processing

        // Simulate successful payment
        const paymentResult = {
          status: "completed",
          transactionId: `TRANS-${Date.now()}`,
        };

        // Update order payment status
        await updateOrderPayment(createdOrder._id, paymentResult);

        alert("Thanh toán thành công!");
        // Clean up localStorage
        if (!isFromCart) {
          localStorage.removeItem("designData");
          localStorage.removeItem("selectedProductId");
        }
        navigate("/history");
      } catch (apiError) {
        console.error("API error:", apiError);
        setError(`Lỗi khi tạo đơn hàng: ${apiError.message}`);
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi đặt hàng");
      console.error("Order error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOrderSummary = () => {
    if (isFromCart && cartItems.length > 0) {
      return (
        <div className="cart-summary">
          <h3>Đơn hàng của bạn ({cartItems.length} sản phẩm)</h3>
          <div className="cart-items-summary">
            {cartItems.map((item, index) => {
              // Use safeAccess to safely get properties from potentially different data formats
              const productName = safeAccess(item, "product.name", "Sản phẩm");
              const size = safeAccess(
                item,
                "size",
                safeAccess(item, "selectedSize", "M")
              );
              const colorName = safeAccess(
                item,
                "colorInfo.name",
                safeAccess(
                  item,
                  "color.name",
                  safeAccess(item, "selectedColor.name", "Mặc định")
                )
              );
              const colorHex = safeAccess(
                item,
                "colorInfo.hexCode",
                safeAccess(
                  item,
                  "color.hexCode",
                  safeAccess(item, "selectedColor.hexCode", "#000000")
                )
              );
              const quantity = safeAccess(item, "quantity", 1);
              const totalPrice = safeAccess(
                item,
                "totalPrice",
                safeAccess(item, "unitPrice", 0) * quantity
              );
              // Find the best image to display
              let imageUrl = safeAccess(item, "imageUrl", "");
              if (!imageUrl) {
                imageUrl = safeAccess(
                  item,
                  "design.previewImage",
                  safeAccess(
                    item,
                    "design.mockupImageUrl",
                    safeAccess(
                      item,
                      "product.imageUrl",
                      safeAccess(item, "product.mockupImageUrl", "")
                    )
                  )
                );
              }

              // Ensure the image URL includes the backend port if it's a relative path
              if (imageUrl && !imageUrl.startsWith("http")) {
                imageUrl =
                  process.env.REACT_APP_API_URL +
                  (imageUrl.startsWith("/") ? "" : "/") +
                  imageUrl;
              }

              return (
                <div key={index} className="cart-item-summary">
                  <div className="item-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={productName} />
                    ) : (
                      <div className="no-image">Không có ảnh</div>
                    )}
                  </div>
                  <div className="item-details">
                    <p className="item-name">{productName}</p>
                    <p className="item-size">Size: {size}</p>
                    <p className="item-color">
                      Màu: {colorName}
                      <span
                        className="color-swatch"
                        style={{ backgroundColor: colorHex }}
                      ></span>
                    </p>
                    <p className="item-quantity">SL: {quantity}</p>
                    <p className="item-price">{totalPrice.toLocaleString()}đ</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else if (designData && productData) {
      // Single product design order
      return (
        <div className="design-summary">
          <h2>Tóm Tắt Thiết Kế</h2>
          <div className="product-preview">
            {designData && designData.previewImage ? (
              <div className="preview-image">
                <img
                  src={designData.previewImage}
                  alt="Design Preview"
                  className="design-preview"
                />
              </div>
            ) : (
              <>
                <div className="preview-image">
                  <div className="preview-placeholder">Mặt Trước</div>
                </div>
                <div className="preview-image">
                  <div className="preview-placeholder">Mặt Sau</div>
                </div>
              </>
            )}
          </div>

          <div className="design-details">
            <p className="design-id">
              {designData
                ? `Thiết kế #${designData._id?.substring(0, 6) || "N/A"}`
                : "Thiết kế mới"}
            </p>
            <p className="brand">
              {productData
                ? `Thương hiệu: ${productData.brand || "N/A"}`
                : "Thương hiệu: N/A"}
            </p>
            {productData && (
              <div className="product-info">
                <p className="product-name">{productData.name}</p>
                <p className="product-size">
                  Kích thước: {productData.size || "M"}
                </p>
                <p className="product-color">
                  Màu: {productData.color?.name || "Mặc định"}
                  {productData.color?.hex && (
                    <span
                      className="color-swatch"
                      style={{ backgroundColor: productData.color.hex }}
                    ></span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return <div className="error-message">Không có thông tin sản phẩm</div>;
    }
  };

  // Render the address section with saved addresses or new address form
  const renderAddressSection = () => {
    return (
      <div className="delivery-info">
        <h3>Thông Tin Giao Hàng</h3>

        {/* Address Selection */}
        {savedAddresses.length > 0 && (
          <div className="address-selection">
            <label>Chọn địa chỉ giao hàng:</label>
            <div className="address-options">
              {savedAddresses.map((address) => (
                <div
                  key={address._id}
                  className={`address-option ${
                    selectedAddressId === address._id ? "selected" : ""
                  }`}
                  onClick={() => handleAddressSelect(address._id)}
                >
                  <div className="address-option-content">
                    <div className="address-name">{address.name}</div>
                    <div className="address-details">
                      <div>{address.phone}</div>
                      <div>
                        {address.street}, {address.ward}, {address.district},{" "}
                        {address.city}
                      </div>
                    </div>
                    {address.isDefault && (
                      <div className="address-default-badge">Mặc định</div>
                    )}
                  </div>
                </div>
              ))}

              <div
                className={`address-option add-new ${
                  isAddingNewAddress ? "selected" : ""
                }`}
                onClick={() => handleAddressSelect("new")}
              >
                <div className="address-option-content">
                  <FiPlusCircle className="add-icon" />
                  <div>Thêm địa chỉ mới</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Show form if adding new address or no saved addresses */}
        {isAddingNewAddress && (
          <>
            <div className="form-group">
              <label htmlFor="name">Tên người nhận</label>
              <input
                type="text"
                id="name"
                name="name"
                value={deliveryInfo.name}
                onChange={handleDeliveryInfoChange}
                placeholder="Ví dụ: Nguyen Van A"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={deliveryInfo.phone}
                onChange={handleDeliveryInfoChange}
                placeholder="0912345678"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="street">Địa chỉ</label>
              <input
                type="text"
                id="street"
                name="street"
                value={deliveryInfo.street}
                onChange={handleDeliveryInfoChange}
                placeholder="Ví dụ: 123 Đường ABC"
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ward">Phường/Xã</label>
                <input
                  type="text"
                  id="ward"
                  name="ward"
                  value={deliveryInfo.ward}
                  onChange={handleDeliveryInfoChange}
                  placeholder="Ví dụ: Phường 1"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="district">Quận/Huyện</label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={deliveryInfo.district}
                  onChange={handleDeliveryInfoChange}
                  placeholder="Ví dụ: Quận 1"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="city">Tỉnh/Thành phố</label>
              <input
                type="text"
                id="city"
                name="city"
                value={deliveryInfo.city}
                onChange={handleDeliveryInfoChange}
                placeholder="Ví dụ: TP. Hồ Chí Minh"
                required
              />
            </div>

            {/* Option to save address */}
            <div className="save-address-option">
              <input
                type="checkbox"
                id="saveAddress"
                checked={saveAddressToProfile}
                onChange={(e) => setSaveAddressToProfile(e.target.checked)}
              />
              <label htmlFor="saveAddress">Lưu địa chỉ này cho lần sau</label>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="order-page">
      <Navbar />
      <div className="order-container">
        {/* Left Section - Design or Cart Summary */}
        <div className="order-summary">
          {renderOrderSummary()}

          <div className="price-breakdown">
            <h3>Chi Tiết Giá</h3>
            <div className="price-item">
              <span>Giá cơ bản:</span>
              <span>{pricingInfo.subtotal.toLocaleString()}đ</span>
            </div>
            <div className="price-item">
              <span>Phí vận chuyển:</span>
              <span>{pricingInfo.shippingFee.toLocaleString()}đ</span>
            </div>
            <div className="price-item">
              <span>Thuế:</span>
              <span>{pricingInfo.tax.toLocaleString()}đ</span>
            </div>
            {pricingInfo.discount > 0 && (
              <div className="price-item discount">
                <span>Giảm giá:</span>
                <span>-{pricingInfo.discount.toLocaleString()}đ</span>
              </div>
            )}
            <div className="price-item total">
              <span>Tổng cộng:</span>
              <span>{pricingInfo.total.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        {/* Right Section - Payment & Delivery */}
        <div className="payment-section">
          <div className="checkout-header">
            <h2>Thanh toán</h2>
            <p>Hoàn tất đơn hàng bằng cách cung cấp thông tin thanh toán</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {isLoading && <div className="loading-message">Đang xử lý...</div>}

          <form onSubmit={handleSubmit}>
            {/* Render address selection or new address form */}
            {renderAddressSection()}

            <div className="payment-methods">
              <h3>Phương Thức Thanh Toán</h3>
              <div className="payment-options">
                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "bank" ? "selected" : ""
                  }`}
                  onClick={() => handlePaymentMethodSelect("bank")}
                >
                  <BsBank className="payment-icon" />
                  <span>Chuyển khoản ngân hàng</span>
                </button>
                <button
                  type="button"
                  className={`payment-option ${
                    paymentMethod === "cod" ? "selected" : ""
                  }`}
                  onClick={() => handlePaymentMethodSelect("cod")}
                >
                  <BsCashStack className="payment-icon" />
                  <span>Thanh toán khi nhận hàng</span>
                </button>
              </div>
            </div>

            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <label htmlFor="terms">
                Tôi xác nhận thông tin trên là chính xác
              </label>
            </div>

            <button
              type="submit"
              className="checkout-button"
              disabled={!paymentMethod || !termsAccepted || isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Thanh toán"}
            </button>
            <p className="security-note">Thanh toán được bảo mật và mã hóa</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Order;
