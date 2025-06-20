import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin-dashboard";
import AdminOrders from "./pages/admin-dashboard/orders";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fortawesome/fontawesome-free/css/all.min.css";
// pages
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import DesignStudio from "./pages/design-studio";
import Cart from "./pages/cart";
import CustomerDashboard from "./pages/customer-dashboard";
import ProfilePage from "./pages/customer-dashboard/profile";
import MyDesigns from "./pages/customer-dashboard/my-designs";
import OrderHistory from "./pages/customer-dashboard/order-history";
import Order from "./pages/order";
import OrderDetails from "./pages/order-details";
import PayOS from "./pages/order/PayOS";
import PaymentError from "./pages/payment-error";
import ProductsPage from "./pages/products";
import SupportPage from "./pages/support"; // Add this import
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import AdminProtectedRoute from "./components/AdminProtectedRoute"; // Import AdminProtectedRoute
import CustomerProtectedRoute from "./components/CustomerProtectedRoute"; // Import CustomerProtectedRoute
import { ToastProvider } from "./contexts/ToastContext";
import SizeGuide from "./pages/size-guide";

// Admin Pages
import AdminDesigns from "./pages/admin-dashboard/designs";
import AdminRevenue from "./pages/admin-dashboard/revenue";
import AdminFeedback from "./pages/admin-dashboard/feedback";
import AdminContact from "./pages/admin-dashboard/contact";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/support" element={<SupportPage />} />{" "}
            {/* Add this route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protected Routes */}
            <Route
              path="/design"
              element={<ProtectedRoute element={<DesignStudio />} />}
            />
            <Route
              path="/cart"
              element={<ProtectedRoute element={<Cart />} />}
            />
            <Route
              path="/order"
              element={<ProtectedRoute element={<Order />} />}
            />
            <Route
              path="/order/payos"
              element={<ProtectedRoute element={<PayOS />} />}
            />
            <Route
              path="/order-details/:id"
              element={<ProtectedRoute element={<OrderDetails />} />}
            />
            <Route path="/payment-error" element={<PaymentError />} />
            {/* Add PaymentSuccess route */}
            {/* Customer Dashboard Protected Routes */}
            <Route
              path="/dashboard/*"
              element={
                <CustomerProtectedRoute element={<CustomerDashboard />} />
              }
            >
              {/* Sub-routes of dashboard are implicitly protected by the parent */}
              <Route path="my-profile" element={<ProfilePage />} />
              <Route path="my-designs" element={<MyDesigns />} />
              <Route path="my-orders-history" element={<OrderHistory />} />
              <Route index element={<ProfilePage />} /> {/* Default tab */}
            </Route>
            {/* Admin Protected Routes */}
            <Route
              path="/admin/*"
              element={<AdminProtectedRoute element={<AdminDashboard />} />}
            >
              {/* Sub-routes of admin are implicitly protected by the parent */}
              <Route path="orders" element={<AdminOrders />} />
              <Route path="designs" element={<AdminDesigns />} />
              <Route path="revenue" element={<AdminRevenue />} />
              <Route path="feedback" element={<AdminFeedback />} />
              <Route path="contact" element={<AdminContact />} />
              <Route index element={<AdminOrders />} />{" "}
              {/* Default admin page */}
            </Route>
            <Route path="/size-guide" element={<SizeGuide />} />
            {/* 404 Not Found route - đặt cuối cùng */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
