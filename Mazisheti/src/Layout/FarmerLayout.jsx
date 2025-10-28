import React from "react";
import FarmerHeader from "../Components/Header/FarmerHeader";
import Footer from "../Components/Footer";
import { Outlet } from "react-router-dom";

const FarmerLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <FarmerHeader />
      <main className="flex-1 py-6 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default FarmerLayout;
