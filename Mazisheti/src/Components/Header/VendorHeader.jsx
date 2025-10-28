// src/Components/Header/VendorHeader.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const VendorHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">🌾 Mazisheti</h1>
      <nav className="space-x-4 flex items-center">
        <Link to="/vendor/add-product" className="hover:underline tour-add-product">
          Add Product
        </Link>
        <Link to="/vendor/view-products" className="hover:underline tour-view-products">
          View Products
        </Link>
        <Link to="/vendor/profile" className="hover:underline tour-profile">
          Profile
        </Link>
        <button onClick={handleLogout} className="hover:underline tour-logout">
          Logout
        </button>
      </nav>
    </header>
  );
};

export default VendorHeader;
