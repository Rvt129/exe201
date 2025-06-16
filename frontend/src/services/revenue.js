// Service for revenue API
const API_URL = "http://localhost:5000/api/revenue";

// Get revenue statistics
export const getRevenueStats = async (timeRange = "7days") => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    console.log(`Fetching revenue stats for ${timeRange}...`);
    const response = await fetch(`${API_URL}/stats?range=${timeRange}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch revenue stats: ${response.status}`);
    }

    const data = await response.json();
    console.log("API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching revenue stats:", error);
    throw error; // Re-throw instead of returning mock data
  }
};

// Get detailed revenue breakdown
export const getRevenueBreakdown = async (startDate, endDate) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      `${API_URL}/breakdown?start=${startDate}&end=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch revenue breakdown: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching revenue breakdown:", error);
    throw error;
  }
};

// Get product revenue analytics
export const getProductRevenue = async (timeRange = "30days") => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/products?range=${timeRange}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch product revenue: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product revenue:", error);
    throw error;
  }
};
