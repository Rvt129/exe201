import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserData } from "../utils/auth";

const CustomerProtectedRoute = ({ element }) => {
  const location = useLocation();
  const { isAuthenticated, isCustomer, role } = getUserData();

  console.log("CustomerProtectedRoute: Role:", role, "IsCustomer:", isCustomer);

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log(
      "CustomerProtectedRoute: Not authenticated, redirecting to /login"
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is customer
  if (!isCustomer) {
    console.log(
      `CustomerProtectedRoute: Access denied. User role: ${role}, required: customer`
    );
    // Redirect based on user's actual role
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated and is customer, render the element
  console.log("CustomerProtectedRoute: Access granted for customer");
  return element;
};

export default CustomerProtectedRoute;
