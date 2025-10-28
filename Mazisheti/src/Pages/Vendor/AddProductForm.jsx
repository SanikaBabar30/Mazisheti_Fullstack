import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddProductForm() {
  const location = useLocation();
  const productType = location.state?.productType || "Uncategorized"; // default
  const vendorId = localStorage.getItem("vendorId");

  const [form, setForm] = useState({
    productName: "",
    brandName: "",
    aboutProduct: "",
    activeIngredient: "",
    effectiveAgainst: "",
    targetCrops: "",
    dosage: "",
    benefits: "",
    packingSize: "",
    batchNumber: "",
    price: "",
    stockQuantity: "",
    releaseDate: "",
    expiryDate: "",
    available: true,
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vendorId) {
      toast.error("Vendor not logged in ❌");
      return;
    }

    try {
      const formData = new FormData();
      const product = { ...form, productType }; // attach productType

      formData.append(
        "product",
        new Blob([JSON.stringify(product)], { type: "application/json" })
      );
      if (form.image) formData.append("image", form.image);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:8082/api/products/vendor/${vendorId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (res.ok) {
        toast.success(`${form.productName} added successfully under ${productType}! ✅`);
        // Reset form
        setForm({
          productName: "",
          brandName: "",
          aboutProduct: "",
          activeIngredient: "",
          effectiveAgainst: "",
          targetCrops: "",
          dosage: "",
          benefits: "",
          packingSize: "",
          batchNumber: "",
          price: "",
          stockQuantity: "",
          releaseDate: "",
          expiryDate: "",
          available: true,
          image: null,
        });
      } else {
        const errText = await res.text();
        toast.error("Failed to add product: " + errText);
      }
    } catch (err) {
      console.error("Error submitting product:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg space-y-6"
        encType="multipart/form-data"
      >
        <h3 className="text-2xl font-bold text-green-700 text-center mb-4">
          Add New Product
        </h3>

        {/* Product Type */}
        <div>
          <label className="block text-sm font-medium text-emerald-600 mb-1">
            Product Type
          </label>
          <input
            type="text"
            value={productType}
            readOnly
            className="w-full border px-4 py-2 rounded-md bg-gray-100 text-gray-700 cursor-not-allowed"
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
            value={form.productName}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-md focus:ring-green-400 focus:ring-2"
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
            value={form.brandName}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded-md focus:ring-green-400 focus:ring-2"
          />
        </div>

        {/* About Product */}
        <div>
          <label className="block text-sm font-medium text-emerald-600 mb-1">
            About Product
          </label>
          <textarea
            name="aboutProduct"
            value={form.aboutProduct}
            onChange={handleChange}
            rows="2"
            className="w-full border px-4 py-2 rounded-md focus:ring-green-400 focus:ring-2"
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
              value={form.activeIngredient}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Active Ingredient"
            />
            <input
              type="text"
              name="effectiveAgainst"
              value={form.effectiveAgainst}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Effective Against"
            />
            <input
              type="text"
              name="targetCrops"
              value={form.targetCrops}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Target Crops"
            />
            <input
              type="text"
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Dosage"
            />
            <textarea
              name="benefits"
              value={form.benefits}
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
              value={form.packingSize}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Packing Size"
            />
            <input
              type="text"
              name="batchNumber"
              value={form.batchNumber}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Batch Number"
            />
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Price"
            />
            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              placeholder="Stock Quantity"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="available"
                checked={form.available}
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
            value={form.releaseDate}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-md mb-2"
          />
          <input
            type="date"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            min={form.releaseDate || ""}
            className="w-full border px-4 py-2 rounded-md"
          />
        </div>

        {/* Image */}
        <div>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white py-2 rounded-md hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}


