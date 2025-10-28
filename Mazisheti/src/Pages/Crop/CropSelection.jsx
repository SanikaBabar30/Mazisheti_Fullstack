import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const categoryImages = {
  Fruits: "/Images/Fruits.jpg",
  Grains: "/Images/Granis.jpg",
  // Add more categories if needed
};

const CropSelection = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [crops, setCrops] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8082/api/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        if (err.response && err.response.status === 403) {
          alert("You are not authorized to view this content.");
        }
      }
    };
    fetchCategories();
  }, [token]);

  // ✅ Fetch crops for selected category
  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    try {
      const res = await axios.get(
        `http://localhost:8082/api/crops/FethchCropsByCategoryId/${category.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCrops(res.data);
    } catch (err) {
      console.error("Error fetching crops:", err);
      if (err.response && err.response.status === 403) {
        alert("You are not authorized to view crops for this category.");
      }
    }
  };

  // ✅ Navigate to crop details
  const handleCropSelect = (crop) => {
    navigate(`/crop/${crop.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-3 sm:px-6 lg:px-8"> {/* Changed px for better mobile padding */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-emerald-600 mb-10 drop-shadow"> {/* Adjusted text size for small screens */}
        🌱 Choose Crop Category
      </h1>

      {/* Category Selection */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10"> {/* Added lg:grid-cols-3 for desktop */}
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className="cursor-pointer group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95" // Added active:scale-95 for mobile tap feedback
            >
              <img
                src={categoryImages[category.name] || "/Images/default.jpg"}
                alt={category.name}
                className="w-full h-48 sm:h-64 object-cover rounded-2xl brightness-90 group-hover:brightness-100" // Reduced height on mobile
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 sm:p-4"> {/* Smaller padding on mobile */}
                <h2 className="text-lg sm:text-2xl font-semibold text-white text-center">
                  {category.name}
                </h2>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Crop Selection */}
      {selectedCategory && (
        <>
          <h2 className="text-2xl sm:text-3xl font-semibold text-center text-emerald-700 mt-8 mb-6">
            Select a {selectedCategory.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-8"> {/* Tighter gap on mobile */}
            {crops.map((crop) => (
              <div
                key={crop.id}
                onClick={() => handleCropSelect(crop)}
                className="cursor-pointer bg-white shadow-md hover:shadow-xl transition rounded-xl overflow-hidden transform hover:scale-105 active:scale-95 duration-300" // Added active:scale-95 for mobile tap
              >
                <img
                  src={crop.imageUrl}
                  alt={crop.name}
                  className="w-full h-36 sm:h-56 object-cover" // Shorter image height on mobile
                />
                <div className="p-2 sm:p-4 text-center"> {/* Smaller padding on mobile */}
                  <h3 className="text-base sm:text-lg font-semibold text-emerald-700">
                    {crop.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 flex flex-col sm:flex-row sm:justify-center gap-4"> {/* Mobile: stacked buttons */}
            <button
              onClick={() => setSelectedCategory(null)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-5 rounded-full shadow-md transition w-full sm:w-auto"
            >
              🔙 Back to Categories
            </button>

            <button
              onClick={() => navigate(-1)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-5 rounded-full shadow-md transition w-full sm:w-auto"
            >
              🔙 Go Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CropSelection;
