import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaLeaf, FaWater, FaSun, FaRegCalendarAlt, FaMountain, FaPlus, FaMinus, FaSnowflake
} from 'react-icons/fa';
import axios from 'axios';

const CropDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [seedTypes, setSeedTypes] = useState([]);
  const [landSize, setLandSize] = useState(1);
  const [seedRequirementKg, setSeedRequirementKg] = useState(null);

  const SEED_KG_PER_ACRE = 50;
  const getAuthToken = () => localStorage.getItem('token');
  const farmerId = localStorage.getItem('farmerId');

  // Fetch Crop details
  useEffect(() => {
    const fetchCrop = async () => {
      try {
        const token = getAuthToken();
        const res = await axios.get(`http://localhost:8082/api/crops/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCrop(res.data);
      } catch (err) {
        console.error('Failed to load crop data', err);
      }
    };
    fetchCrop();
  }, [id]);

  // Fetch Seed Types
  useEffect(() => {
    const fetchSeedTypes = async () => {
      try {
        const token = getAuthToken();
        const res = await axios.get(`http://localhost:8082/api/seedtypes/byCrop/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSeedTypes(res.data);
      } catch (err) {
        console.error('Failed to load seed types', err);
      }
    };
    if (id) fetchSeedTypes();
  }, [id]);

  // Calculate seed requirement
  useEffect(() => {
    setSeedRequirementKg(landSize * SEED_KG_PER_ACRE);
  }, [landSize]);

  if (!crop) return <div className="text-center mt-20 text-lg">Loading crop details...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-emerald-700 text-center mb-10 drop-shadow">
        🌿 {crop.name} - Crop Details
      </h1>

      {/* ✅ Responsive Crop Images */}
      <div className="mb-8">
        <img
          src={crop.mobileImageUrl || crop.imageUrl}
          alt={`${crop.name} mobile`}
          className="sm:hidden w-full h-64 object-cover rounded-xl shadow-md"
        />
        <img
          src={crop.desktopImageUrl || crop.imageUrl}
          alt={`${crop.name} desktop`}
          className="hidden sm:block w-full h-96 object-cover rounded-xl shadow-lg"
        />
      </div>

      {/* ✅ Two-column mobile info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-10">
        <div className="bg-white border-2 border-green-300 rounded-xl p-4 sm:p-6 shadow-lg text-center">
          <FaLeaf className="text-3xl sm:text-4xl text-green-600 mx-auto mb-3" />
          <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-1">Soil</h2>
          <p className="text-sm sm:text-base">{crop.soil}</p>
        </div>

        <div className="bg-white border-2 border-yellow-300 rounded-xl p-4 sm:p-6 shadow-lg text-center">
          <FaWater className="text-3xl sm:text-4xl text-yellow-600 mx-auto mb-3" />
          <h2 className="text-lg sm:text-xl font-bold text-yellow-700 mb-1">Nutrients</h2>
          <p className="text-sm sm:text-base">{crop.nutrients}</p>
        </div>

        <div className="bg-white border-2 border-blue-300 rounded-xl p-4 sm:p-6 shadow-lg text-center">
          <FaRegCalendarAlt className="text-3xl sm:text-4xl text-blue-600 mx-auto mb-3" />
          <h2 className="text-lg sm:text-xl font-bold text-blue-700 mb-1">Season</h2>
          <p className="text-sm sm:text-base">{crop.season}</p>
        </div>

        <div className="bg-white border-2 border-orange-300 rounded-xl p-4 sm:p-6 shadow-lg text-center">
          <FaSun className="text-3xl sm:text-4xl text-orange-600 mx-auto mb-3" />
          <h2 className="text-lg sm:text-xl font-bold text-orange-700 mb-1">Climate</h2>
          <p className="text-sm sm:text-base">{crop.climate}</p>
        </div>

        <div className="bg-white border-2 border-cyan-300 rounded-xl p-4 sm:p-6 shadow-lg text-center">
          <FaSnowflake className="text-3xl sm:text-4xl text-cyan-600 mx-auto mb-3" />
          <h2 className="text-lg sm:text-xl font-bold text-cyan-700 mb-1">Snowing Season</h2>
          <p className="text-sm sm:text-base">{crop.snowingSeason}</p>
        </div>
      </div>

      {/* Seed Types */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 text-center text-emerald-700">Seed Types</h2>
        {seedTypes.length === 0 ? (
          <p className="text-center text-gray-600">No seed types found for this crop.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seedTypes.map(seed => (
              <li key={seed.id} className="border rounded-lg p-4 shadow hover:shadow-lg transition">
                <h3 className="font-bold text-lg text-emerald-700 mb-1">{seed.name}</h3>
                <p><strong>Type:</strong> {seed.type}</p>
                <p><strong>Seeds Per Acre:</strong> {seed.seedsPerAcre}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Land Size Selector */}
      <div className="text-center mb-10">
        <label className="text-lg font-semibold text-gray-700">Land Size (in acres):</label>
        <div className="inline-flex items-center mt-4 space-x-4 justify-center">
          <button
            onClick={() => setLandSize(prev => Math.max(1, prev - 1))}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
          >
            <FaMinus />
          </button>
          <div className="flex items-center space-x-2">
            <FaMountain className="text-2xl text-emerald-600" />
            <input
              type="number"
              min="1"
              value={landSize}
              onChange={(e) => setLandSize(Math.max(1, Number(e.target.value)))}
              className="border-2 border-emerald-700 p-2 rounded-md w-24 text-center"
            />
          </div>
          <button
            onClick={() => setLandSize(prev => prev + 1)}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Seed Requirement */}
      {seedRequirementKg !== null && (
        <div className="bg-emerald-300 border-l-4 border-emerald-700 p-4 rounded-md text-center mb-8">
          <p className="text-blue-800 font-medium">
            🌱 You will need approximately <strong>{seedRequirementKg.toFixed(2)}</strong> kilograms of seeds
            for <strong>{landSize}</strong> acre(s).
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="text-center">
        <button
          onClick={() =>
            navigate(`/schedules/${farmerId}/${id}`, {
              state: {
                cropName: crop.name,
                seedType: seedTypes[0]?.name || '',
                quantity: seedRequirementKg,
                landSize: landSize,
              }
            })
          }
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-full font-medium text-lg shadow-md transition"
        >
          📅 Proceed to Schedule
        </button>
        <button
          onClick={() => navigate('/crop/selection')}
          className="ml-6 text-emerald-600 hover:underline font-medium"
        >
          ← Back to Crops
        </button>
      </div>
    </div>
  );
};

export default CropDetails;
