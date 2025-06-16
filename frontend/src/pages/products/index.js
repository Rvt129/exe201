import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Products.css";
import {
  getMyDesigns,
  getPublicDesigns,
  deleteDesign,
  updateDesign,
} from "../../services/designs";
import {
  fetchCustomizableProducts,
  formatPrice,
  getAvailablePetTypes,
  getAllSizesForPet,
} from "../../services/products";
import { addToCart } from "../../services/cart";
import Navbar from "../../components/layout/Navbar";

const ProductsPage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [myDesigns, setMyDesigns] = useState([]);
  const [publicDesigns, setPublicDesigns] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedPetTypes, setSelectedPetTypes] = useState({}); // New state for pet types
  const [showSizeModal, setShowSizeModal] = useState(null); // Modal for size selection
  const [pendingCartItem, setPendingCartItem] = useState(null); // Item pending cart addition

  // Pagination states
  const [myDesignsPagination, setMyDesignsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDesigns: 0,
    limit: 12,
  });

  const [publicDesignsPagination, setPublicDesignsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDesigns: 0,
    limit: 12,
  });

  useEffect(() => {
    loadData();
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async (page = 1) => {
    setLoading(true);
    setError(null); // Reset error state
    console.log(`Loading data for tab: ${activeTab}, page: ${page}`);

    try {
      const token = localStorage.getItem("token");
      console.log(`Token found: ${token ? "YES" : "NO"}`);

      switch (activeTab) {
        case "myDesigns":
          if (!token) {
            console.log("No token found for myDesigns");
            setError("Vui lòng đăng nhập để xem thiết kế của bạn");
            setMyDesigns([]);
            setMyDesignsPagination({
              currentPage: 1,
              totalPages: 1,
              totalDesigns: 0,
              limit: 12,
            });
          } else {
            try {
              console.log("Fetching my designs...");
              const response = await getMyDesigns(
                token,
                page,
                myDesignsPagination.limit
              );
              console.log("My designs response:", response);
              setMyDesigns(response.designs || []);
              setMyDesignsPagination({
                ...myDesignsPagination,
                currentPage: response.currentPage || 1,
                totalPages: response.totalPages || 1,
                totalDesigns: response.totalDesigns || 0,
              });
            } catch (designError) {
              console.error("Error loading my designs:", designError);
              if (
                designError.message.includes("401") ||
                designError.message.includes("403")
              ) {
                setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
                localStorage.removeItem("token"); // Clear invalid token
              } else {
                setError("Không thể tải danh sách thiết kế. Vui lòng thử lại");
              }
              setMyDesigns([]);
            }
          }
          break;
        case "publicDesigns":
          try {
            console.log("Fetching public designs...");
            const publicData = await getPublicDesigns({
              page: page,
              limit: publicDesignsPagination.limit,
            });
            console.log("Public designs response:", publicData);
            setPublicDesigns(publicData.designs || []);
            setPublicDesignsPagination({
              ...publicDesignsPagination,
              currentPage: publicData.currentPage || 1,
              totalPages: publicData.totalPages || 1,
              totalDesigns: publicData.totalDesigns || 0,
            });
          } catch (publicError) {
            console.error("Error loading public designs:", publicError);
            setError(
              "Không thể tải danh sách thiết kế công khai. Vui lòng thử lại"
            );
            setPublicDesigns([]);
          }
          break;
        case "products":
          try {
            console.log("Fetching products...");
            const productsData = await fetchCustomizableProducts();
            console.log("Products response:", productsData);
            setProducts(productsData);
            // Initialize selected colors, sizes, and pet types
            const initialColors = {};
            const initialSizes = {};
            const initialPetTypes = {};
            productsData.forEach((product) => {
              if (product.colors && product.colors.length > 0) {
                initialColors[product._id] = product.colors[0];
              }
              // Don't auto-select size - user must choose
              if (product.sizes && product.sizes.length > 0) {
                initialSizes[product._id] = ""; // Empty by default
              }
              // Set default pet type to dog
              const availablePetTypes = getAvailablePetTypes(product);
              if (availablePetTypes.length > 0) {
                initialPetTypes[product._id] = availablePetTypes.includes("dog")
                  ? "dog"
                  : availablePetTypes[0];
              }
            });
            setSelectedColors(initialColors);
            setSelectedSizes(initialSizes);
            setSelectedPetTypes(initialPetTypes);
          } catch (productsError) {
            console.error("Error loading products:", productsError);
            setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại");
            setProducts([]);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (activeTab === "myDesigns") {
      setMyDesignsPagination((prev) => ({ ...prev, currentPage: page }));
    } else if (activeTab === "publicDesigns") {
      setPublicDesignsPagination((prev) => ({ ...prev, currentPage: page }));
    }
    loadData(page);
  };

  const renderPagination = (pagination) => {
    if (pagination.totalPages <= 1) return null;

    const { currentPage, totalPages, totalDesigns } = pagination;
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination-container">
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
            Trước
          </button>

          <div className="pagination-numbers">
            {startPage > 1 && (
              <>
                <button
                  className="pagination-number"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
                {startPage > 2 && (
                  <span className="pagination-ellipsis">...</span>
                )}
              </>
            )}

            {pages.map((page) => (
              <button
                key={page}
                className={`pagination-number ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}

            {endPage < totalPages && (
              <>
                {endPage < totalPages - 1 && (
                  <span className="pagination-ellipsis">...</span>
                )}
                <button
                  className="pagination-number"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="pagination-info">
          Hiển thị {(currentPage - 1) * pagination.limit + 1} -{" "}
          {Math.min(currentPage * pagination.limit, totalDesigns)} trong tổng số{" "}
          {totalDesigns} thiết kế
        </div>
      </div>
    );
  };

  const handleDeleteDesign = async (designId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thiết kế này?")) {
      try {
        const token = localStorage.getItem("token");
        await deleteDesign(designId, token);
        setMyDesigns(myDesigns.filter((design) => design._id !== designId));
      } catch (error) {
        console.error("Error deleting design:", error);
        alert("Có lỗi xảy ra khi xóa thiết kế");
      }
    }
  };

  const handleTogglePublic = async (designId, currentPublicStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập để thay đổi trạng thái thiết kế");
        return;
      }

      await updateDesign(designId, { isPublic: !currentPublicStatus }, token);

      // Update local state
      setMyDesigns((prevDesigns) =>
        prevDesigns.map((design) =>
          design._id === designId
            ? { ...design, isPublic: !currentPublicStatus }
            : design
        )
      );

      alert(
        !currentPublicStatus
          ? "Thiết kế đã được đặt thành công khai"
          : "Thiết kế đã được đặt thành riêng tư"
      );
    } catch (error) {
      console.error("Error toggling design public status:", error);
      alert("Có lỗi xảy ra khi thay đổi trạng thái thiết kế");
    }
  };

  const handleColorChange = (productId, color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [productId]: color,
    }));
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const handlePetTypeChange = (productId, petType) => {
    setSelectedPetTypes((prev) => ({
      ...prev,
      [productId]: petType,
    }));
    // Clear selected size when pet type changes
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: "",
    }));
  };

  const handleAddToCart = async (
    product,
    design = null,
    selectedSize = null
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
        return;
      }

      // Check if pet type is selected
      const currentPetType = selectedPetTypes[product._id];
      if (!currentPetType) {
        alert("Vui lòng chọn loại thú cưng trước khi thêm vào giỏ hàng");
        return;
      }

      // For regular products, check if size is selected or show modal
      if (!design && !selectedSize) {
        const currentSize = selectedSizes[product._id];
        if (!currentSize) {
          // Show size selection modal
          setPendingCartItem({ product, design });
          setShowSizeModal(product._id);
          return;
        }
        selectedSize = currentSize;
      }

      // For designs, use the design's selected size and pet type
      if (design && !selectedSize) {
        selectedSize = design.selectedSize;
      }

      if (!selectedSize) {
        alert("Vui lòng chọn kích thước trước khi thêm vào giỏ hàng");
        return;
      }

      const cartItem = {
        product: product._id,
        design: design?._id || null,
        quantity: 1,
        size: selectedSize,
        petType: currentPetType,
        color: selectedColors[product._id] || null,
        customization: null,
      };

      await addToCart(cartItem, token);
      alert("Đã thêm vào giỏ hàng thành công!");

      // Close modal if it was open
      setShowSizeModal(null);
      setPendingCartItem(null);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng");
    }
  };

  const handleSizeModalConfirm = (size) => {
    if (pendingCartItem && size) {
      handleAddToCart(pendingCartItem.product, pendingCartItem.design, size);
    }
  };

  const handleSizeModalClose = () => {
    setShowSizeModal(null);
    setPendingCartItem(null);
  };

  // Get price for selected size and pet type
  const getPriceForSize = (product, sizeName, petType = "dog") => {
    if (!product.sizes || !sizeName || !petType) return 0;
    const sizeObj = product.sizes.find((s) => s.name === sizeName);
    if (
      !sizeObj ||
      !sizeObj.baseCost ||
      !sizeObj.baseCost[petType.toLowerCase()]
    ) {
      return 0;
    }
    return sizeObj.baseCost[petType.toLowerCase()];
  };

  // Get price range for product based on pet type
  const getPriceRange = (product, petType = "dog") => {
    if (!product.sizes || product.sizes.length === 0) return "0";

    const availableSizes = getAllSizesForPet(product, petType);
    if (availableSizes.length === 0) return "0";

    const prices = availableSizes.map((s) => s.baseCost).filter((p) => p > 0);
    if (prices.length === 0) return "0";

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return formatPrice(minPrice);
    }
    return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getMainImage = (product) => {
    const selectedColor = selectedColors[product._id];
    if (selectedColor && selectedColor.mockupImageUrl) {
      return selectedColor.mockupImageUrl;
    }
    if (product.colors && product.colors.length > 0) {
      return product.colors[0].mockupImageUrl || product.baseImageUrl;
    }
    return product.baseImageUrl;
  };

  const renderProducts = () => (
    <div className="content-section active">
      <div className="section-header">
        <h2>Sản Phẩm</h2>
        <p>Chọn sản phẩm để bắt đầu thiết kế của bạn</p>
      </div>

      {error ? (
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button onClick={() => loadData()} className="cta-button">
            <i className="fas fa-redo"></i>
            Thử Lại
          </button>
        </div>
      ) : loading ? (
        <div className="loading">
          <i className="fas fa-spinner"></i>
          Đang tải...
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-tshirt"></i>
          <h3>Chưa có sản phẩm</h3>
          <p>Hiện tại chưa có sản phẩm nào có thể tùy chỉnh</p>
        </div>
      ) : (
        <>
          <div className="items-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={getMainImage(product) || "/placeholder-product.png"}
                    alt={product.name}
                    className="product-main-image"
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  {product.description && (
                    <p className="product-description">{product.description}</p>
                  )}

                  {/* Options Container */}
                  <div className="product-options">
                    {/* Pet Type Selection */}
                    <div className="pet-type-options">
                      <label className="pet-type-options-label">
                        Loại thú cưng:
                      </label>
                      <div className="pet-type-buttons">
                        {getAvailablePetTypes(product).map((petType) => (
                          <button
                            key={petType}
                            className={`pet-type-btn ${
                              selectedPetTypes[product._id] === petType
                                ? "active"
                                : ""
                            }`}
                            onClick={() =>
                              handlePetTypeChange(product._id, petType)
                            }
                          >
                            <i
                              className={`fas ${
                                petType === "dog" ? "fa-dog" : "fa-cat"
                              }`}
                            ></i>
                            {petType === "dog" ? "Chó" : "Mèo"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Options */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="color-options">
                        <label className="color-options-label">Màu sắc:</label>
                        <div className="color-swatches">
                          {product.colors.map((color, index) => (
                            <div
                              key={index}
                              className={`color-swatch ${
                                selectedColors[product._id]?.name === color.name
                                  ? "active"
                                  : ""
                              }`}
                              title={color.name}
                              onClick={() =>
                                handleColorChange(product._id, color)
                              }
                            >
                              {color.mockupImageUrl && (
                                <img
                                  src={color.mockupImageUrl}
                                  alt={color.name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: "6px",
                                  }}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Options - only show sizes available for selected pet type */}
                    {selectedPetTypes[product._id] && (
                      <div className="size-options">
                        <label className="size-options-label">
                          Kích thước:
                        </label>
                        <div className="size-buttons">
                          {getAllSizesForPet(
                            product,
                            selectedPetTypes[product._id]
                          ).map((size, index) => (
                            <button
                              key={index}
                              className={`size-btn ${
                                selectedSizes[product._id] === size.name
                                  ? "active"
                                  : ""
                              }`}
                              disabled={!size.isAvailable}
                              onClick={() =>
                                handleSizeChange(product._id, size.name)
                              }
                              title={`Trọng lượng: ${size.weightRange}`}
                            >
                              <span className="size-name">{size.name}</span>
                              <span className="size-price">
                                {formatPrice(size.baseCost)}
                              </span>
                              <small className="size-weight">
                                {size.weightRange}
                              </small>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="product-meta">
                    <div className="product-price">
                      {selectedSizes[product._id] &&
                      selectedPetTypes[product._id] ? (
                        <>
                          {formatPrice(
                            getPriceForSize(
                              product,
                              selectedSizes[product._id],
                              selectedPetTypes[product._id]
                            )
                          )}
                          <span> / sản phẩm</span>
                        </>
                      ) : selectedPetTypes[product._id] ? (
                        <>
                          {getPriceRange(
                            product,
                            selectedPetTypes[product._id]
                          )}
                          <span> / sản phẩm</span>
                        </>
                      ) : (
                        <span>Chọn loại thú cưng để xem giá</span>
                      )}
                      {product.designFee && (
                        <small className="design-fee-note">
                          + {formatPrice(product.designFee)} phí thiết kế
                        </small>
                      )}
                    </div>

                    <div className="product-actions">
                      <Link
                        to={`/design?product=${product._id}&color=${
                          selectedColors[product._id]?.name || ""
                        }&size=${selectedSizes[product._id] || ""}&petType=${
                          selectedPetTypes[product._id] || ""
                        }`}
                        className="action-btn customize-btn"
                      >
                        <i className="fas fa-paint-brush"></i>
                        Tùy Chỉnh
                      </Link>
                      <button
                        className="action-btn add-to-cart-btn"
                        onClick={() => handleAddToCart(product)}
                      >
                        <i className="fas fa-shopping-cart"></i>
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Size Selection Modal */}
          {showSizeModal && (
            <div className="modal-overlay" onClick={handleSizeModalClose}>
              <div className="size-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Chọn kích thước</h3>
                  <button className="close-btn" onClick={handleSizeModalClose}>
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <p>Vui lòng chọn kích thước cho sản phẩm:</p>
                  <div className="modal-size-options">
                    {(() => {
                      const product = products.find(
                        (p) => p._id === showSizeModal
                      );
                      const petType = selectedPetTypes[showSizeModal] || "dog";
                      return getAllSizesForPet(product, petType)?.map(
                        (size) => (
                          <button
                            key={size.name}
                            className="modal-size-btn"
                            disabled={!size.isAvailable}
                            onClick={() => handleSizeModalConfirm(size.name)}
                            title={`Trọng lượng: ${size.weightRange}`}
                          >
                            <span className="size-name">{size.name}</span>
                            <span className="size-price">
                              {formatPrice(size.baseCost)}
                            </span>
                            <small className="size-weight">
                              {size.weightRange}
                            </small>
                          </button>
                        )
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderMyDesigns = () => (
    <div className="content-section active">
      <div className="section-header">
        <h2>Thiết Kế Của Tôi</h2>
        <p>Quản lý và chỉnh sửa các thiết kế bạn đã tạo</p>
      </div>

      {error ? (
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          {error.includes("đăng nhập") && (
            <Link to="/login" className="cta-button">
              <i className="fas fa-sign-in-alt"></i>
              Đăng Nhập
            </Link>
          )}
          <button
            onClick={() => loadData()}
            className="cta-button secondary"
            style={{ marginLeft: error.includes("đăng nhập") ? "10px" : "0" }}
          >
            <i className="fas fa-redo"></i>
            Thử Lại
          </button>
        </div>
      ) : loading ? (
        <div className="loading">
          <i className="fas fa-spinner"></i>
          Đang tải...
        </div>
      ) : myDesigns.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-palette"></i>
          <h3>Chưa có thiết kế nào</h3>
          <p>
            Bạn chưa tạo thiết kế nào. Hãy bắt đầu tạo thiết kế đầu tiên của
            bạn!
          </p>
          <Link to="/design" className="cta-button">
            <i className="fas fa-plus"></i>
            Tạo Thiết Kế Mới
          </Link>
        </div>
      ) : (
        <>
          <div className="items-grid">
            {myDesigns.map((design) => (
              <div key={design._id} className="design-card">
                {design.isPublic && (
                  <div className="public-badge">Công khai</div>
                )}
                <img
                  src={
                    design.previewImage
                      ? `http://localhost:5000${design.previewImage}`
                      : "/placeholder-design.png"
                  }
                  alt={design.name}
                  className="design-image"
                />
                <div className="design-info">
                  <h3 className="design-name">
                    {design.name || "Thiết kế không tên"}
                  </h3>
                  {design.description && (
                    <p className="design-description">{design.description}</p>
                  )}
                  <div className="design-meta">
                    <span className="design-author">Của bạn</span>
                    <span className="design-date">
                      {formatDate(design.createdAt)}
                    </span>
                    {design.selectedSize && (
                      <span className="design-size">
                        Size: {design.selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="design-pricing">
                    {design.calculatedPrice && (
                      <span className="design-price">
                        {formatPrice(design.calculatedPrice)}
                      </span>
                    )}
                  </div>
                  {design.tags && design.tags.length > 0 && (
                    <div className="design-tags">
                      {design.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="design-actions">
                    <button
                      onClick={() =>
                        handleAddToCart(design.product || {}, design)
                      }
                      className="action-btn primary"
                    >
                      <i className="fas fa-shopping-cart"></i>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {renderPagination(myDesignsPagination)}
        </>
      )}
    </div>
  );

  const renderPublicDesigns = () => (
    <div className="content-section active">
      <div className="section-header">
        <h2>Thiết Kế Công Khai</h2>
        <p>Khám phá và lấy cảm hứng từ cộng đồng thiết kế</p>
      </div>

      {error ? (
        <div className="error-state">
          <i className="fas fa-exclamation-triangle"></i>
          <h3>Có lỗi xảy ra</h3>
          <p>{error}</p>
          <button onClick={() => loadData()} className="cta-button">
            <i className="fas fa-redo"></i>
            Thử Lại
          </button>
        </div>
      ) : loading ? (
        <div className="loading">
          <i className="fas fa-spinner"></i>
          Đang tải...
        </div>
      ) : publicDesigns.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-users"></i>
          <h3>Chưa có thiết kế công khai</h3>
          <p>Hiện tại chưa có thiết kế công khai nào từ cộng đồng</p>
        </div>
      ) : (
        <>
          <div className="items-grid">
            {publicDesigns.map((design) => (
              <div key={design._id} className="design-card">
                <div className="public-badge">Công khai</div>
                <img
                  src={
                    design.previewImage
                      ? `http://localhost:5000${design.previewImage}`
                      : "/placeholder-design.png"
                  }
                  alt={design.name}
                  className="design-image"
                />
                <div className="design-info">
                  <h3 className="design-name">
                    {design.name || "Thiết kế không tên"}
                  </h3>
                  {design.description && (
                    <p className="design-description">{design.description}</p>
                  )}
                  <div className="design-meta">
                    <span className="design-author">
                      Bởi{" "}
                      {design.user?.name || design.user?.firstName || "Ẩn danh"}
                    </span>
                    <span className="design-date">
                      {formatDate(design.createdAt)}
                    </span>
                    {design.selectedSize && (
                      <span className="design-size">
                        Size: {design.selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="design-pricing">
                    {design.calculatedPrice && (
                      <span className="design-price">
                        {formatPrice(design.calculatedPrice)}
                      </span>
                    )}
                  </div>
                  {design.tags && design.tags.length > 0 && (
                    <div className="design-tags">
                      {design.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="design-actions">
                    <button
                      onClick={() =>
                        handleAddToCart(design.product || {}, design)
                      }
                      className="action-btn primary"
                    >
                      <i className="fas fa-shopping-cart"></i>
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {renderPagination(publicDesignsPagination)}
        </>
      )}
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="products-page">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">
              <span className="gradient-text">Sản Phẩm</span> & Thiết Kế
            </h1>
            <p className="page-subtitle">
              Khám phá sản phẩm, quản lý thiết kế và tìm cảm hứng từ cộng đồng
            </p>
          </div>

          <div className="section-tabs">
            <button
              className={`tab-button ${
                activeTab === "products" ? "active" : ""
              }`}
              onClick={() => setActiveTab("products")}
            >
              <i className="fas fa-tshirt"></i>
              Sản Phẩm
            </button>
            <button
              className={`tab-button ${
                activeTab === "myDesigns" ? "active" : ""
              }`}
              onClick={() => setActiveTab("myDesigns")}
            >
              <i className="fas fa-palette"></i>
              Thiết Kế Của Tôi
            </button>
            <button
              className={`tab-button ${
                activeTab === "publicDesigns" ? "active" : ""
              }`}
              onClick={() => setActiveTab("publicDesigns")}
            >
              <i className="fas fa-users"></i>
              Thiết Kế Công Khai
            </button>
          </div>

          {activeTab === "products" && renderProducts()}
          {activeTab === "myDesigns" && renderMyDesigns()}
          {activeTab === "publicDesigns" && renderPublicDesigns()}
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
