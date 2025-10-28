import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:8082/api/products/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProduct(data);
        if (data.imagePath) {
          setPreview(`http://localhost:8082${data.imagePath}`);
        }
      } catch (err) {
        setError("Error fetching product details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append(
        "product",
        new Blob([JSON.stringify(product)], { type: "application/json" })
      );
      if (image) {
        formData.append("image", image);
      }

      await axios.put(`http://localhost:8082/api/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Product updated successfully!");
      navigate("/vendor/view-products");
    } catch (err) {
      setError("Error updating product");
      console.error(err);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg space-y-6"
        encType="multipart/form-data"
      >
        <h3 className="text-2xl font-bold text-green-700 text-center mb-4">
          Edit Product
        </h3>

        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium text-emerald-600 mb-1">
            Product Type
          </label>
          <input
            type="text"
            name="productType"
            value={product.productType || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md"
            required
          />
        </div>

        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-emerald-600 mb-1">
            Product Name
          </label>
          <input
            type="text"
            name="productName"
            value={product.productName || ""}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        {/* Brand Name */}
        <div>
          <label className="block text-sm font-medium text-emerald-600 mb-1">
            Brand Name
          </label>
          <input
            type="text"
            name="brandName"
            value={product.brandName || ""}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium text-emerald-600 mb-1">
            About Product
          </label>
          <textarea
            name="aboutProduct"
            value={product.aboutProduct || ""}
            onChange={handleChange}
            rows="2"
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        {/* Composition & Usage */}
        <div>
          <h4 className="text-lg font-semibold text-emerald-700 border-b pb-1 mb-3">
            Composition & Usage
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              name="activeIngredient"
              value={product.activeIngredient || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Active Ingredient"
            />
            <input
              type="text"
              name="effectiveAgainst"
              value={product.effectiveAgainst || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Effective Against"
            />
            <input
              type="text"
              name="targetCrops"
              value={product.targetCrops || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Target Crops"
            />
            <input
              type="text"
              name="dosage"
              value={product.dosage || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Dosage"
            />
            <textarea
              name="benefits"
              value={product.benefits || ""}
              onChange={handleChange}
              rows="2"
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Benefits"
            />
          </div>
        </div>

        {/* Stock & Pricing */}
        <div>
          <h4 className="text-lg font-semibold text-emerald-700 border-b pb-1 mb-3">
            Stock & Pricing
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              name="packingSize"
              value={product.packingSize || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Packing Size"
            />
            <input
              type="text"
              name="batchNumber"
              value={product.batchNumber || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Batch Number"
            />
            <input
              type="number"
              name="price"
              value={product.price || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Price"
            />
            <input
              type="number"
              name="stockQuantity"
              value={product.stockQuantity || ""}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Stock Quantity"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="available"
                checked={product.available || false}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <label className="text-gray-700">Product Available</label>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div>
          <input
            type="date"
            name="releaseDate"
            value={product.releaseDate || ""}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md mb-2"
          />
          <input
            type="date"
            name="expiryDate"
            value={product.expiryDate || ""}
            onChange={handleChange}
            min={product.releaseDate || ""}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        {/* Image */}
        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
