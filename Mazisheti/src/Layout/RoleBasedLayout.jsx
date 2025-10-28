// src/Layout/RoleBasedLayout.jsx
import React from "react";
import GuestHeader from "../Components/Header/GuestHeader";
import FarmerHeader from "../Components/Header/FarmerHeader";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

const RoleBasedLayout = () => {
  const role = localStorage.getItem("role");

  const Header = role === "FARMER" ? FarmerHeader : GuestHeader;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-gray-50 py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RoleBasedLayout;
