import React from 'react';
import AdminNavbar from './AdminNavbar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminNavbar />

      {/* Page content */}
      <div className="flex-1 ml-0 lg:ml-64 p-4 bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
