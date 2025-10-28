import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddProductPage() {
  const [productTypes, setProductTypes] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchProductTypes = async () => {
    try {
      const res = await axios.get("http://localhost:8082/api/admin/product-types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductTypes(res.data);
    } catch (error) {
      console.error("Error fetching product types:", error);
    }
  };

  useEffect(() => {
    fetchProductTypes();
  }, []);

  const handleSelect = (id, name) => {
    navigate(`/vendor/add-product/${id}`, {
      state: { productType: name }, // pass only name
    });
  };

  return (
    <div className="min-h-screen bg-green-100 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-emerald-700 mb-8">
          Select Product Type
        </h2>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productTypes.map((category, index) => (
            <div
              key={index}
              className="bg-white text-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105 cursor-pointer border border-emerald-700"
              onClick={() => handleSelect(category.id, category.name)}
            >
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div
                  className="p-4 rounded-full shadow-md mb-3 w-24 h-24 flex items-center justify-center"
                  style={{ border: `4px solid ${category.borderColor || "#4CAF50"}` }}
                >
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </div>
                <h3 className="text-base sm:text-lg font-semibold">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
