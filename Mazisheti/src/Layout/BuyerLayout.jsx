// src/Layout/BuyerLayout.jsx
import React from "react";
import BuyerHeader from "../Components/Header/BuyerHeader";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

const BuyerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <BuyerHeader />
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default BuyerLayout;