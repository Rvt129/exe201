import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserData } from "../utils/auth";

const ProtectedRoute = ({ element, requiredRole = null }) => {
  const location = useLocation();
  const { isAuthenticated, role } = getUserData();

  console.log("ProtectedRoute: Role:", role, "Required Role:", requiredRole);

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if specific role is required and user has that role
  if (requiredRole && role !== requiredRole) {
    console.log(
      `ProtectedRoute: Access denied. Required: ${requiredRole}, User has: ${role}`
    );
    // Redirect to appropriate page based on user's role
    if (role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (role === "customer") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated and has required role (or no role required), render the element
  return element;
};

export default ProtectedRoute;
