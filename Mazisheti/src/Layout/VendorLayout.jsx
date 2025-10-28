// src/Layout/VendorLayout.jsx
import React from "react";
import VendorHeader from "../Components/Header/VendorHeader";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

const VendorLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <VendorHeader />
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default VendorLayout;
