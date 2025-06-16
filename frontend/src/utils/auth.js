// Authentication utilities
export const saveUserSession = (userData) => {
  // Store authentication token
  localStorage.setItem("token", userData.token);

  // Store user role for protected routes
  localStorage.setItem("role", userData.role);

  // Store user profile data
  localStorage.setItem(
    "user",
    JSON.stringify({
      id: userData._id,
      email: userData.email,
      firstName: userData.profile?.firstName,
      lastName: userData.profile?.lastName,
      role: userData.role,
    })
  );
};

export const clearUserSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
  localStorage.removeItem("cart"); // Clear cart data as well
};

export const getUserData = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return {
    token,
    role,
    isAuthenticated: token !== null,
    isAdmin: role === "admin",
    isCustomer: role === "customer",
  };
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

export const navigateByRole = (role, navigate) => {
  if (role === "admin") {
    navigate("/admin");
  } else if (role === "customer") {
    navigate("/");
  } else {
    navigate("/");
  }
};
