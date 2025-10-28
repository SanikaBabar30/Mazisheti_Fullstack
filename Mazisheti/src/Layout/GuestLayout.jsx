import React, { useEffect, useState } from 'react';
import GuestHeader from '../Components/Header/GuestHeader';
import FarmerHeader from '../Components/Header/FarmerHeader';
import Footer from '../Components/Footer';
import { Outlet } from 'react-router-dom';

const GuestLayout = () => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // assuming 'FARMER' or 'ADMIN'
    setRole(storedRole?.toUpperCase());
  }, []);

  return (
    <>
      {role === "FARMER" ? <FarmerHeader /> : <GuestHeader />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default GuestLayout;
