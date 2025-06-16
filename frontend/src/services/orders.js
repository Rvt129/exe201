// Service for orders API
const API_URL = "http://localhost:5000/api/orders";

// Get all orders with pagination (likely for admin)
export const getOrders = async (page = 1, limit = 8) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Get orders for the current logged-in user with pagination
export const getMyOrders = async (page = 1, limit = 8) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/my?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch your orders: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching your orders:", error);
    throw error;
  }
};

// Get recent orders (last 3)
export const getRecentOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/recent`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch recent orders: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Validate that all items have required size information
    if (orderData.items && orderData.items.length > 0) {
      for (const item of orderData.items) {
        if (!item.size) {
          throw new Error(
            `Size is required for item: ${item.name || "Unknown item"}`
          );
        }
      }
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create order: ${response.status} - ${errorText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Update order payment status
export const updateOrderPayment = async (orderId, paymentData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Use PUT for confirming payment as per backend route definition
    const response = await fetch(`${API_URL}/${orderId}/confirm-payment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const errorBody = await response.json(); // Attempt to get more detailed error
      throw new Error(
        `Failed to update order payment: ${response.status} - ${
          errorBody.message || "Unknown error"
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating order payment for ${orderId}:`, error);
    throw error;
  }
};

// Cancel an order
export const cancelOrder = async (orderId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/${orderId}/cancel`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to cancel order: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw error;
  }
};

// Update order status (Admin only)
export const updateOrderStatus = async (orderId, statusData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(statusData),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(
        `Failed to update order status: ${response.status} - ${
          errorBody.message || "Unknown error"
        }`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating order status for ${orderId}:`, error);
    throw error;
  }
};
