// Service for /api/cart
export async function addToCart(
  { product, design, quantity, size, petType, color, customization },
  token
) {
  // Kiểm tra và xử lý dữ liệu đầu vào
  if (!product) {
    console.error("Missing required product ID for addToCart");
    throw new Error("Product ID is required");
  }

  if (!size) {
    console.error("Size is required for pricing calculation");
    throw new Error("Size is required");
  }

  if (!petType || !["cat", "dog"].includes(petType.toLowerCase())) {
    console.error("Pet type is required and must be 'cat' or 'dog'");
    throw new Error("Pet type is required and must be 'cat' or 'dog'");
  }

  const response = await fetch(process.env.REACT_APP_API_URL + "/api/cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId: product,
      designId: design || null,
      quantity: quantity || 1,
      size: size, // Required for price calculation
      petType: petType.toLowerCase(), // Required for price calculation
      color: color || null,
      customization: customization || null,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Add to cart error:", response.status, errorData);
    throw new Error(`Failed to add to cart: ${response.status} - ${errorData}`);
  }

  return response.json();
}

export async function getCart(token) {
  const response = await fetch(process.env.REACT_APP_API_URL + "/api/cart", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Get cart error:", response.status, errorData);
    throw new Error(`Failed to get cart: ${response.status} - ${errorData}`);
  }

  // Đọc response body thành JSON
  const data = await response.json();

  // Log dữ liệu đã chuyển đổi thành JSON để dễ xem
  console.log("Cart data from API:", data);

  return data;
}

export async function removeItemFromCart(itemId, token) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/cart/${itemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Remove item from cart error:", response.status, errorData);
    throw new Error(
      `Failed to remove item from cart: ${response.status} - ${errorData}`
    );
  }
  return response.json(); // Or handle no content response if API returns 204
}

export async function updateItemQuantity(itemId, quantity, token) {
  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/cart/${itemId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    }
  );
  if (!response.ok) {
    const errorData = await response.text();
    console.error("Update item quantity error:", response.status, errorData);
    throw new Error(
      `Failed to update item quantity: ${response.status} - ${errorData}`
    );
  }
  return response.json();
}

export async function updateItemSize(itemId, size, token) {
  // Kiểm tra đầu vào
  if (!itemId || !size || !token) {
    console.error("Missing required parameters for updateItemSize");
    throw new Error("Missing required parameters");
  }

  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/cart/${itemId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        size,
        // Backend will recalculate price based on new size
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Update item size error:", response.status, errorData);
    throw new Error(
      `Failed to update item size: ${response.status} - ${errorData}`
    );
  }

  return response.json();
}

export async function updateItemPetType(itemId, petType, token) {
  // Kiểm tra đầu vào
  if (!itemId || !petType || !token) {
    console.error("Missing required parameters for updateItemPetType");
    throw new Error("Missing required parameters");
  }

  if (!["cat", "dog"].includes(petType.toLowerCase())) {
    console.error("Pet type must be 'cat' or 'dog'");
    throw new Error("Pet type must be 'cat' or 'dog'");
  }

  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/cart/${itemId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        petType: petType.toLowerCase(),
        // Backend will recalculate price based on new pet type
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Update item pet type error:", response.status, errorData);
    throw new Error(
      `Failed to update item pet type: ${response.status} - ${errorData}`
    );
  }

  return response.json();
}

export async function updateCartItem(itemId, updates, token) {
  // Kiểm tra đầu vào
  if (!itemId || !updates || !token) {
    console.error("Missing required parameters for updateCartItem");
    throw new Error("Missing required parameters");
  }

  // Validate pet type if provided
  if (
    updates.petType &&
    !["cat", "dog"].includes(updates.petType.toLowerCase())
  ) {
    console.error("Pet type must be 'cat' or 'dog'");
    throw new Error("Pet type must be 'cat' or 'dog'");
  }

  const response = await fetch(
    process.env.REACT_APP_API_URL + `/api/cart/${itemId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...updates,
        petType: updates.petType?.toLowerCase(),
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Update cart item error:", response.status, errorData);
    throw new Error(
      `Failed to update cart item: ${response.status} - ${errorData}`
    );
  }

  return response.json();
}

// Helper functions for cart display
export function formatCartItemPrice(item) {
  if (!item || typeof item.unitPrice !== "number") return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(item.unitPrice);
}

export function formatCartTotal(total) {
  if (typeof total !== "number") return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(total);
}

export function getCartItemDisplayInfo(item) {
  if (!item) return null;

  return {
    id: item._id,
    productName: item.product?.name || "Unknown Product",
    designName: item.design?.name || null,
    petType: item.petType,
    petTypeDisplay: item.petType === "dog" ? "Chó" : "Mèo",
    size: item.size,
    weightRange: item.weightRange || "N/A",
    quantity: item.quantity,
    baseCost: item.baseCost,
    designFee: item.designFee || 0,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    color: item.color,
    hasDesign: !!item.design,
    isCustomizable: item.designFee > 0,
  };
}

export function calculateCartSummary(cart) {
  if (!cart || !cart.items || !Array.isArray(cart.items)) {
    return {
      itemCount: 0,
      subtotal: 0,
      designFeeTotal: 0,
      total: 0,
    };
  }

  const itemCount = cart.items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  const subtotal = cart.items.reduce(
    (sum, item) => sum + (item.baseCost || 0) * (item.quantity || 0),
    0
  );
  const designFeeTotal = cart.items.reduce(
    (sum, item) => sum + (item.designFee || 0) * (item.quantity || 0),
    0
  );
  const total = cart.total || 0;

  return {
    itemCount,
    subtotal,
    designFeeTotal,
    total,
  };
}
