import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUserCheck,
  faSeedling,
  faBoxes,  // 📦 icon for product types
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const AdminNavbar = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getActiveClass = (path) => {
    return location.pathname === path
      ? "bg-green-900 font-semibold shadow-md"
      : "hover:bg-green-800";
  };

  const iconColor = "text-green-300"; 
  const activeIconColor = "text-white"; 

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-20 text-white p-2 bg-green-600 rounded-md shadow-md"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        ☰ Menu
      </button>

      {/* Sidebar */}
      <aside
        className={`lg:block lg:w-64 w-64 bg-emerald-600 fixed top-0 left-0 h-full p-6 z-10 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="mb-10 text-center">
          <h2 className="text-white text-3xl font-bold tracking-wide">
            🌿 Admin Panel
          </h2>
        </div>

        <nav>
          <ul className="space-y-2 text-white">
            <li>
              <Link
                to="/admin-dashboard"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 py-2 px-4 rounded-md transition ${getActiveClass(
                  "/admin-dashboard"
                )}`}
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  className={
                    location.pathname === "/admin-dashboard"
                      ? activeIconColor
                      : iconColor
                  }
                />
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/approval"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 py-2 px-4 rounded-md transition ${getActiveClass(
                  "/admin/approval"
                )}`}
              >
                <FontAwesomeIcon
                  icon={faUserCheck}
                  className={
                    location.pathname === "/admin/approval"
                      ? activeIconColor
                      : iconColor
                  }
                />
                Approve Farmers
              </Link>
            </li>
            <li>
              <Link
                to="/admin/manage-crops"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 py-2 px-4 rounded-md transition ${getActiveClass(
                  "/admin/manage-crops"
                )}`}
              >
                <FontAwesomeIcon
                  icon={faSeedling}
                  className={
                    location.pathname === "/admin/manage-crops"
                      ? activeIconColor
                      : iconColor
                  }
                />
                Manage Crops
              </Link>
            </li>
            {/* NEW LINK for Product Type Manager */}
            <li>
              <Link
                to="/admin/product-types"
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 py-2 px-4 rounded-md transition ${getActiveClass(
                  "/admin/product-types"
                )}`}
              >
                <FontAwesomeIcon
                  icon={faBoxes}
                  className={
                    location.pathname === "/admin/product-types"
                      ? activeIconColor
                      : iconColor
                  }
                />
                Product Types
              </Link>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 py-2 px-4 rounded-md hover:bg-red-600 transition text-left"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="text-red-200" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default AdminNavbar;