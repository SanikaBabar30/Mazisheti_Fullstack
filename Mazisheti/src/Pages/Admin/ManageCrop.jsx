import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Fallback images for hardcoded categories
const fallbackImages = {
  Fruits: "/Images/Fruits.jpg",
  Grains: "/Images/Granis.jpg", 
};

const ManagerCrop = () => {
  const [crop, setCrop] = useState({
    name: "",
    soil: "",
    nutrients: "",
    climate: "",
    season: "",
    snowingSeason: "",
    category: "",
  });

  const [selectedCropName, setSelectedCropName] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [categoryImage, setCategoryImage] = useState(null);
  const [crops, setCrops] = useState([]);
  const [file, setFile] = useState(null);
  const [seedFile, setSeedFile] = useState(null);
  const [stageFile, setStageFile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      toast.error("Authorization token is missing. Please log in again.");
    } else {
      fetchCategories();
      fetchCrops();
    }
  }, [token]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8082/api/crop-categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch {
      toast.error("Failed to fetch crop categories");
    }
  };

  const fetchCrops = async () => {
    try {
      const res = await axios.get("http://localhost:8082/api/crops", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCrops(res.data);
    } catch {
      toast.error("Failed to fetch crops");
    }
  };

  const handleCropChange = (e) => {
    setCrop({ ...crop, [e.target.name]: e.target.value });
  };

  const handleCropSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Missing token. Cannot submit.");

    try {
      const formData = new FormData();
      Object.entries(crop).forEach(([key, value]) => {
        if (key === "category") {
          formData.append("category.id", value);
        } else {
          formData.append(key, value);
        }
      });
      if (file) formData.append("image", file);

      await axios.post("http://localhost:8082/api/crops", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Crop added successfully");
      setCrop({
        name: "",
        soil: "",
        nutrients: "",
        climate: "",
        season: "",
        snowingSeason: "",
        category: "",
      });
      setFile(null);
      fetchCrops();
    } catch {
      toast.error("Error saving crop");
    }
  };

  const handleSeedUpload = async () => {
    if (!token || !seedFile) return toast.error("Missing token or file.");

    const formData = new FormData();
    formData.append("file", seedFile);

    try {
      const res = await axios.post("http://localhost:8082/api/seedtypes/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message || "Seed Types uploaded successfully.");
    } catch {
      toast.error("Failed to upload Seed Types.");
    }
  };

  const handleStageUpload = async () => {
    if (!token || !stageFile || !selectedCropName)
      return toast.error("Missing token, crop selection, or file.");

    const formData = new FormData();
    formData.append("file", stageFile);
    formData.append("cropName", selectedCropName);

    try {
      const res = await axios.post("http://localhost:8082/api/crop-stage/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(res.data.message || "Crop Stages uploaded successfully.");
    } catch {
      toast.error("Failed to upload Crop Stages.");
    }
  };

  const handleCategoryChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Missing token. Cannot submit category.");

    try {
      const formData = new FormData();
      formData.append("name", newCategory.name);
      if (categoryImage) formData.append("image", categoryImage);

      await axios.post("http://localhost:8082/api/crop-categories", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Crop Category added successfully");
      setNewCategory({ name: "" });
      setCategoryImage(null);
      fetchCategories();
    } catch {
      toast.error("Error saving crop category");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-green-50 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-green-700">🌿 Admin Crop Management</h2>

      {/* Crop Category Form */}
      <form onSubmit={handleCategorySubmit} className="mb-10 bg-white p-5 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-green-800">➕ Add Crop Category</h3>
        <input
          type="text"
          name="name"
          value={newCategory.name}
          onChange={handleCategoryChange}
          placeholder="Category Name"
          className="border p-2 rounded w-full mb-3"
          required
        />
        <input
          type="file"
          onChange={(e) => setCategoryImage(e.target.files[0])}
          className="mb-3"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Add Category
        </button>
      </form>

      {/* Show Categories */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-3 text-green-700">📂 Existing Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const imgSrc = cat.imageUrl || fallbackImages[cat.name];
            return (
              <div key={cat.id} className="bg-white p-3 rounded shadow">
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className="h-32 w-full object-cover rounded mb-2"
                  />
                )}
                <p className="font-semibold">{cat.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Crop Form */}
      <form onSubmit={handleCropSubmit} className="bg-white p-5 rounded-xl shadow-md mb-10">
        <h3 className="text-2xl font-semibold mb-4 text-green-800">🌾 Add New Crop</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={crop.name}
            onChange={handleCropChange}
            placeholder="Crop Name"
            className="border p-2 rounded"
            required
          />
          <select
            name="category"
            value={crop.category}
            onChange={handleCropChange}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="soil"
            value={crop.soil}
            onChange={handleCropChange}
            placeholder="Soil"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="nutrients"
            value={crop.nutrients}
            onChange={handleCropChange}
            placeholder="Nutrients"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="climate"
            value={crop.climate}
            onChange={handleCropChange}
            placeholder="Climate"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="season"
            value={crop.season}
            onChange={handleCropChange}
            placeholder="Season"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="snowingSeason"
            value={crop.snowingSeason}
            onChange={handleCropChange}
            placeholder="Snowing Season"
            className="border p-2 rounded"
          />
        </div>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mt-3"
        />
        <button
          type="submit"
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Add Crop
        </button>
      </form>

      {/* Show Crops */}
      <div className="mb-10">
        <h3 className="text-xl font-bold mb-3 text-green-700">🌾 Existing Crops</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {crops.map((c) => (
            <div key={c.id} className="bg-white p-3 rounded shadow">
              {c.imageUrl && (
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  className="h-32 w-full object-cover rounded mb-2"
                />
              )}
              <p className="font-semibold">{c.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seed File Upload */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-8">
        <h3 className="text-2xl font-semibold mb-4 text-green-800">🌱 Upload Seed File</h3>
        <input type="file" onChange={(e) => setSeedFile(e.target.files[0])} className="mb-3" />
        <button
          onClick={handleSeedUpload}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Upload Seed File
        </button>
      </div>

      {/* Stage File Upload */}
      <div className="bg-white p-5 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold mb-4 text-green-800">🌿 Upload Crop Stage File</h3>
        <select
          value={selectedCropName}
          onChange={(e) => setSelectedCropName(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        >
          <option value="">Select Crop</option>
          {crops.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <input type="file" onChange={(e) => setStageFile(e.target.files[0])} className="mb-3" />
        <button
          onClick={handleStageUpload}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Upload Stage File
        </button>
      </div>
    </div>
  );
};

export default ManagerCrop;