// src/Components/Header/BuyerHeader.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const BuyerHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-emerald-700 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">🌾 Mazisheti</h1>

      <nav className="space-x-4 flex items-center">
        {/* ✅ Corrected links: lowercase & hyphenated paths */}
        <Link
          to="/buyer/view-products"
          className="hover:underline tour-view-products"
        >
          View Products
        </Link>

        <Link
          to="/buyer/place-orders"
          className="hover:underline tour-place-orders"
        >
          Place Orders
        </Link>

        <Link
          to="/buyer/view-order-history"
          className="hover:underline tour-view-order-history"
        >
          View Order History
        </Link>

        <Link
          to="/buyer/reviews-&-ratings"
          className="hover:underline tour-reviews-&-ratings"
        >
          Reviews & Ratings
        </Link>

        <Link
          to="/buyer/discounts"
          className="hover:underline tour-discounts"
        >
          Discounts
        </Link>

        <button
          onClick={handleLogout}
          className="hover:underline tour-logout"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default BuyerHeader;
