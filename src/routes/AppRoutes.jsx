import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Dashboard from "../pages/dashboard/Dashboard";
import ProtectedRoute from '../components/auth/ProtectedRoute'
import BusinessSignup from "../pages/auth/BusinessSignup";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Products from "../pages/products/Products";
import AddProduct from "../pages/products/AddProduct";
import Brands from "../pages/products/Brands";
import Categories from "../pages/products/Categories";
import BulkUpload from "../pages/products/BulkUpload";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/signup/business"
        element={<BusinessSignup />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/add"
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/brands"
        element={
          <ProtectedRoute>
            <Brands />
          </ProtectedRoute>
        }
      />

      <Route
        path="/products/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <ProtectedRoute>
            <Categories />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products/bulk-upload"
        element={
          <ProtectedRoute>
            <BulkUpload />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;