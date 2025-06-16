import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserData } from "../utils/auth";

const AdminProtectedRoute = ({ element }) => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, role } = getUserData();

  console.log("AdminProtectedRoute: Role:", role, "IsAdmin:", isAdmin);

  // Check if user is authenticated
  if (!isAuthenticated) {
    console.log(
      "AdminProtectedRoute: Not authenticated, redirecting to /login"
    );
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user is admin
  if (!isAdmin) {
    console.log(
      `AdminProtectedRoute: Access denied. User role: ${role}, required: admin`
    );
    // Redirect based on user's actual role
    if (role === "customer") {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated and is admin, render the element
  console.log("AdminProtectedRoute: Access granted for admin");
  return element;
};

export default AdminProtectedRoute;
