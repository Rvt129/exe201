// Service for /api/products
const API_URL = "http://localhost:5000/api/products";

export async function fetchProducts(params = {}) {
  try {
    const url = new URL(API_URL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null)
        url.searchParams.append(key, value);
    });
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch products: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function fetchProductById(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Không tìm thấy sản phẩm");
      }
      throw new Error(`Lỗi khi tải thông tin sản phẩm: ${response.status}`);
    }
    const product = await response.json();
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
}

export async function fetchCustomizableProducts() {
  try {
    const response = await fetch(`${API_URL}/customizable`);
    if (!response.ok)
      throw new Error(
        `Failed to fetch customizable products: ${response.status}`
      );
    return response.json();
  } catch (error) {
    console.error("Error fetching customizable products:", error);
    throw error;
  }
}

export async function fetchProductPricing(id, petType) {
  try {
    const response = await fetch(`${API_URL}/${id}/pricing/${petType}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          "Không tìm thấy sản phẩm hoặc không có size phù hợp cho loại thú cưng này"
        );
      }
      if (response.status === 400) {
        throw new Error(
          "Loại thú cưng không hợp lệ. Chỉ hỗ trợ 'cat' hoặc 'dog'"
        );
      }
      throw new Error(`Lỗi khi tải thông tin giá sản phẩm: ${response.status}`);
    }
    const pricingData = await response.json();
    return pricingData;
  } catch (error) {
    console.error(
      `Error fetching product pricing for ${id} (${petType}):`,
      error
    );
    throw error;
  }
}

export async function createProduct(product, token) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    if (!response.ok)
      throw new Error(`Failed to create product: ${response.status}`);
    return response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}

// Helper function to calculate total price including design fee
export function calculateTotalPrice(
  baseCost,
  designFee = 0,
  isCustomizable = false
) {
  const cost = typeof baseCost === "number" ? baseCost : 0;
  const fee = isCustomizable
    ? typeof designFee === "number"
      ? designFee
      : 0
    : 0;
  return cost + fee;
}

// Helper function to format price in VND
export function formatPrice(price) {
  if (typeof price !== "number") return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Helper function to get available pet types from product
export function getAvailablePetTypes(product) {
  if (!product || !product.sizes || !Array.isArray(product.sizes)) {
    return [];
  }

  const petTypes = new Set();

  product.sizes.forEach((size) => {
    if (size.baseCost) {
      if (size.baseCost.cat && size.isAvailable) {
        petTypes.add("cat");
      }
      if (size.baseCost.dog && size.isAvailable) {
        petTypes.add("dog");
      }
    }
  });

  return Array.from(petTypes);
}

// Helper function to get size information for specific pet type
export function getSizeInfoForPet(product, petType, sizeName) {
  if (!product || !product.sizes || !Array.isArray(product.sizes)) {
    return null;
  }

  const size = product.sizes.find((s) => s.name === sizeName && s.isAvailable);
  if (!size || !size.baseCost || !size.baseCost[petType.toLowerCase()]) {
    return null;
  }

  return {
    name: size.name,
    baseCost: size.baseCost[petType.toLowerCase()],
    weightRange: size.weightRange
      ? size.weightRange[petType.toLowerCase()]
      : "N/A",
    totalPrice: calculateTotalPrice(
      size.baseCost[petType.toLowerCase()],
      product.designFee,
      product.isCustomizable
    ),
    isAvailable: size.isAvailable,
  };
}

// Helper function to get all available sizes for a pet type from product
export function getAllSizesForPet(product, petType) {
  if (!product || !product.sizes || !Array.isArray(product.sizes)) {
    return [];
  }

  return product.sizes
    .filter(
      (size) =>
        size.isAvailable &&
        size.baseCost &&
        size.baseCost[petType.toLowerCase()]
    )
    .map((size) => ({
      name: size.name,
      baseCost: size.baseCost[petType.toLowerCase()],
      weightRange: size.weightRange
        ? size.weightRange[petType.toLowerCase()]
        : "N/A",
      totalPrice: calculateTotalPrice(
        size.baseCost[petType.toLowerCase()],
        product.designFee,
        product.isCustomizable
      ),
      isAvailable: size.isAvailable,
    }));
}
