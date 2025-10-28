import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStore, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCogs, FaIdCard } from "react-icons/fa";

const VendorInfo = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    let interval;

    const fetchVendor = async (vendorId) => {
      try {
        const res = await axios.get(`http://localhost:8082/api/vendors/view/${vendorId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setVendor(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching vendor info:", err);
        setError("Failed to load vendor profile");
        setLoading(false);
      }
    };

    interval = setInterval(() => {
      const vendorId = localStorage.getItem("vendorId");
      if (vendorId) {
        fetchVendor(vendorId);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [token]);

  if (loading)
    return <p className="text-center mt-6 text-gray-600">Loading profile...</p>;
  if (error)
    return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 flex flex-col md:flex-row gap-6">
      
      {/* Left Panel - Green */}
      <div className="md:w-1/3 bg-emerald-600 text-white flex flex-col items-center p-6 rounded-xl shadow-lg">
        {vendor.profileImagePath ? (
          <img
            src={`http://localhost:8082${vendor.profileImagePath}`}
            alt="Vendor"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold">
            {vendor.ownerName[0]}
          </div>
        )}
        <h2 className="mt-4 text-2xl font-bold text-center">{vendor.ownerName}</h2>
      </div>

      {/* Right Panel - White */}
      <div className="md:w-2/3 p-6 bg-gray-50 rounded-xl shadow-lg">
        <h3 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-3">
          <svg
            className="w-8 h-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A9 9 0 1119.88 6.196a9 9 0 01-14.757 11.608z"
            />
          </svg>
          Vendor Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: <FaStore className="text-emerald-600 w-6 h-6" />, label: "Shop Name", value: vendor.shopName },
            { icon: <FaEnvelope className="text-emerald-600 w-6 h-6" />, label: "Email", value: vendor.email },
            { icon: <FaPhone className="text-emerald-600 w-6 h-6" />, label: "Mobile", value: vendor.mobileNumber },
            { icon: <FaMapMarkerAlt className="text-emerald-600 w-6 h-6" />, label: "Address", value: vendor.shopAddress },
            { icon: <FaCogs className="text-emerald-600 w-6 h-6" />, label: "Product Type", value: vendor.productType },
            { icon: <FaIdCard className="text-emerald-600 w-6 h-6" />, label: "License Number", value: vendor.licenseNumber },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 shadow hover:shadow-md transition"
            >
              {item.icon}
              <div>
                <p className="text-gray-500 text-sm">{item.label}</p>
                <p className="font-medium text-gray-700">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorInfo;
