// Service for users API
const API_URL = "http://localhost:5000/api/users";

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Registration failed: ${response.status}`
      );
    }

    const data = await response.json();

    // Store token in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data._id,
          email: data.email,
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          role: data.role,
        })
      );
    }

    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Login failed: ${response.status}`);
    }

    const data = await response.json();

    // Store token and user data in localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data._id,
          email: data.email,
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          role: data.role,
        })
      );
    }

    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  // Clear any other stored user data
  localStorage.removeItem("cart");
};

// Get current user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, logout user
        logoutUser();
      }
      throw new Error(`Failed to fetch profile: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to update profile: ${response.status}`
      );
    }

    const data = await response.json();

    // Update stored user data
    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data._id,
          email: data.email,
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          role: data.role,
        })
      );
    }

    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to change password: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// Get all user addresses
export const getUserAddresses = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Check if it's an authentication issue
      if (response.status === 401) {
        logoutUser(); // Clear invalid token
        throw new Error("Authentication failed. Please login again.");
      }

      // Try to parse error message from response
      try {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to fetch addresses: ${response.status}`
        );
      } catch (jsonError) {
        throw new Error(`Failed to fetch addresses: ${response.status}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    // Return empty array instead of throwing when there's an error
    // This prevents the UI from crashing
    return [];
  }
};

// Add new address
export const addUserAddress = async (addressData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to add address: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding user address:", error);
    throw error;
  }
};

// Update address
export const updateUserAddress = async (addressId, addressData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/addresses/${addressId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to update address: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating address ${addressId}:`, error);
    throw error;
  }
};

// Delete address
export const deleteUserAddress = async (addressId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete address: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting address ${addressId}:`, error);
    throw error;
  }
};

// Set address as default
export const setDefaultAddress = async (addressId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/addresses/${addressId}/default`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to set default address: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error setting default address ${addressId}:`, error);
    throw error;
  }
};

// Toggle 2FA
export const toggle2FA = async (enable) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/2fa`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ enable }),
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle 2FA: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error toggling 2FA:", error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token;
};

// Get current user data from localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

// Check if user is admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "admin";
};

// ADMIN FUNCTIONS

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Not authorized as admin");
      }
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

// Get user by ID (admin only)
export const getUserById = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Not authorized as admin");
      }
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Update user (admin only)
export const updateUser = async (userId, userData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Not authorized as admin");
      }
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to update user: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// Delete user (admin only)
export const deleteUser = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${API_URL}/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Not authorized as admin");
      }
      throw new Error(`Failed to delete user: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
  toggle2FA,
  isAuthenticated,
  getCurrentUser,
  isAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
