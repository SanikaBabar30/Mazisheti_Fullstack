import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

// Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/FarmerRegister";
import AdminPage from "./Pages/AdminPage";
import ProductTypeManager from "./Pages/Admin/ProductTypeManager";

import CropOverview from "./Pages/Crop/Crops";
import CompleteProfile from "./Pages/Crop/CompleteProfile";
import CropSelection from "./Pages/Crop/CropSelection";
import Schedule from "./Pages/Crop/Schedule";
import CropDetails from "./Pages/Crop/CropDetails";
import SavedSchedules from "./Pages/Crop/SavedSchedules";
import SellMarkets from "./Pages/Crop/SellMarkets";
import CropMedicines from "./Pages/Crop/CropMedicines";

import AdminNavbar from "./Components/AdminNavbar";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import Approval from "./Pages/Admin/Approval";
import ManageCrop from "./Pages/Admin/ManageCrop";

import ProtectedRoute from "./Components/ProtectedRoute";
import LanguageSelector from "./Components/LanguageSelector";

import GuestLayout from "./Layout/GuestLayout";
import FarmerLayout from "./Layout/FarmerLayout";
import RoleBasedLayout from "./Layout/RoleBasedLayout";
import VendorLayout from "./Layout/VendorLayout";
import BuyerLayout from "./Layout/BuyerLayout";

// Vendor Pages
import VendorRegister from "./Pages/VendorRegister";
import MyProducts from "./Pages/Vendor/MyProducts";
import VendorInfo from "./Pages/Vendor/VendorInfo";
import VendorDashboard from "./Pages/Vendor/VendorDashboard";
import AddProductPage from "./Pages/Vendor/AddProductPage";
import AddProductForm from "./Pages/Vendor/AddProductForm";
import EditProduct from "./Pages/Vendor/EditProduct";
import BuyerRegister from "./Pages/BuyerRegister";
import BuyerDashboard from "./Pages/Buyer/BuyerDashboard";
//import ViewProducts from "./Pages/Buyer/ViewProducts";
import PlaceOrders from "./Pages/Buyer/PlaceOrders"; // ✅ New Page
import BuyerCart from "./Pages/Buyer/BuyerCart";

import AboutUs from "./Pages/AboutUs";
import BuyerMarketplace from "./Pages/Buyer/BuyerMarketplace";
import BuyerProductDetails from "./Pages/Buyer/BuyerProductDetails";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/login");
  };

  // Update role whenever location changes (after login, etc.)
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole?.toUpperCase() || null);
  }, [location]);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAdminLoginPage = location.pathname === "/admin-login";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* Show admin navbar only when logged in as ADMIN */}
      {!isAdminLoginPage && isAdminRoute && role === "ADMIN" && (
        <AdminNavbar onLogout={handleLogout} />
      )}

      {/* Global Language Selector */}
      <LanguageSelector />

      <div
        className={`${
          isAdminRoute ? "ml-64 p-6" : "p-6"
        } flex-1 bg-white shadow-md rounded-lg`}
      >
        <div className="flex-1 bg-white w-full min-h-screen">
          <Routes>
            {/* Home route with role-based layout */}
            <Route element={<RoleBasedLayout />}>
              <Route path="/" element={<Home />} />
            </Route>

            {/* Guest-only routes */}
            <Route element={<GuestLayout />}>
              <Route path="/about" element={<AboutUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/vendor-register" element={<VendorRegister />} />
              <Route path="/buyer-register" element={<BuyerRegister />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin-login" element={<AdminPage />} />

            {/* Farmer Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["FARMER"]}>
                  <FarmerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/crop" element={<CropOverview />} />
              <Route path="/crop/complete-profile" element={<CompleteProfile />} />
              <Route path="/crop/selection" element={<CropSelection />} />
              <Route path="/crop/medicines" element={<CropMedicines />} />
              <Route path="/crop/:id" element={<CropDetails />} />
              <Route path="/schedules/:farmerId/:cropId" element={<Schedule />} />
              <Route path="/saved-schedules" element={<SavedSchedules />} />
              <Route path="/sell-markets" element={<SellMarkets />} />
            </Route>

            {/* Vendor Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["VENDOR"]}>
                  <VendorLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/vendor-dashboard" element={<VendorDashboard />} />
              <Route path="/vendor/add-product" element={<AddProductPage />} />
              <Route path="/vendor/add-product/:productType" element={<AddProductForm />} />
              <Route path="/vendor/view-products" element={<MyProducts />} />
              <Route path="/vendor/profile" element={<VendorInfo />} />
               <Route path="/vendor/edit-product/:id" element={<EditProduct />} />
              
            </Route>

            {/* Buyer Routes */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["BUYER"]}>
                  <BuyerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/buyer/view-products" element={<BuyerMarketplace />} />
              {/* ✅ New PlaceOrders Route */}
              <Route path="/buyer/place-orders" element={<PlaceOrders />} />
              <Route path="/buyer/product/:id" element={<BuyerProductDetails />} />
              <Route path="/buyer/cart" element={<BuyerCart />} />


            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approval"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <Approval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/manage-crops"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ManageCrop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/product-types"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ProductTypeManager />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
