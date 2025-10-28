import React from "react";
import { useNavigate } from "react-router-dom";

const Crops = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-emerald-700 mb-6 text-center sm:text-left">
        🌾 View Crop Information
      </h1>

      <div className="grid gap-6">
        {/* Profile Section */}
        <section className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">👤 Farmer Profile</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Complete your profile to get personalized crop recommendations.
          </p>
          <button
            onClick={() => navigate("/crop/complete-profile")}
            className="mt-4 w-full sm:w-auto bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
          >
            Complete Profile
          </button>
        </section>

        {/* Choose Crop Section */}
        <section className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">🌱 Choose a Crop</h2>
          <p className="text-gray-600 text-sm sm:text-base mb-2">
            Select the crop you are interested in:
          </p>
          <button
            onClick={() => navigate("/crop/selection")}
            className="mt-4 w-full sm:w-auto bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
          >
            Go to Crop Selection
          </button>
        </section>

        {/* Crop Medicines Section */}
        <section className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">💊 Crop Medicines</h2>
          <button
            onClick={() => navigate("/crop/medicines")}
            className="mt-4 w-full sm:w-auto bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
          >
            View Crop Medicines
          </button>
        </section>

        {/* Sell Markets Section */}
        <section className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">🏪 Crop Selling Markets</h2>
          <button
            onClick={() => navigate("/sell-markets")}
            className="w-full sm:w-auto bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
          >
            View Market Sell
          </button>
        </section>
      </div>
    </div>
  );
};

export default Crops;
