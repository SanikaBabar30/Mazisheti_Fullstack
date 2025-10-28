import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductManager() {
  const [productTypes, setProductTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [newType, setNewType] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);

  const [editTypeId, setEditTypeId] = useState(null);
  const [editTypeName, setEditTypeName] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  const token = localStorage.getItem("token");

  // ===== Fetch Product Types =====
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

  // ===== Fetch All Products =====
  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8082/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProductTypes();
    fetchAllProducts();
  }, []);

  // ===== Add Product Type =====
  const handleAddType = async () => {
    if (!newType.trim() || !newImage) {
      toast.error("Please enter a type name and upload an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newType);
      formData.append("image", newImage);

      await axios.post("http://localhost:8082/api/admin/product-types", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product type added successfully");
      setNewType("");
      setNewImage(null);
      setNewImagePreview(null);
      fetchProductTypes();
    } catch {
      toast.error("Error adding product type");
    }
  };

  // ===== Edit Product Type =====
  const handleEditType = async (id) => {
    if (!editTypeName.trim()) {
      toast.error("Please enter a product type name");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", editTypeName);
      if (editImage) formData.append("image", editImage);

      await axios.put(`http://localhost:8082/api/admin/product-types/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product type updated successfully");
      setEditTypeId(null);
      setEditTypeName("");
      setEditImage(null);
      setEditImagePreview(null);
      fetchProductTypes();
    } catch {
      toast.error("Error updating product type");
    }
  };

  // ===== Delete Product Type =====
  const handleDeleteType = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product type?")) return;
    try {
      await axios.delete(`http://localhost:8082/api/admin/product-types/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product type deleted successfully");
      fetchProductTypes();
    } catch {
      toast.error("Error deleting product type");
    }
  };

  // ===== Enable / Disable Product =====
  const toggleProductStatus = async (productId, isActive) => {
    try {
      const url = isActive
        ? `http://localhost:8082/api/products/disable/${productId}`
        : `http://localhost:8082/api/products/enable/${productId}`;
      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(`Product ${isActive ? "disabled" : "enabled"} successfully`);
      fetchAllProducts();
    } catch {
      toast.error("Error updating product status");
    }
  };

  // ===== Filter Products by Category =====
  const filteredProducts = selectedType
    ? products.filter((p) => p.productType === selectedType.name)
    : [];

  return (
    <div className="bg-green-50 min-h-screen p-8">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-center text-green-700 mb-8">
        🛍️ Product Management Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ================== Box 1: Add Product Type ================== */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">🧩 Add / Manage Product Types</h3>

          {/* Add Form */}
          <div className="space-y-3 mb-6">
            <input
              type="text"
              placeholder="Enter product type name"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                setNewImage(file);
                setNewImagePreview(file ? URL.createObjectURL(file) : null);
              }}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {newImagePreview && (
              <img
                src={newImagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded border"
              />
            )}
            <button
              onClick={handleAddType}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Add Product Type
            </button>
          </div>

          {/* Manage Existing Types */}
          <div className="space-y-3">
            {productTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between border p-2 rounded hover:bg-green-50 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={type.imageUrl || "https://via.placeholder.com/80"}
                    alt={type.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  {editTypeId === type.id ? (
                    <input
                      type="text"
                      value={editTypeName}
                      onChange={(e) => setEditTypeName(e.target.value)}
                      className="border p-1 rounded"
                    />
                  ) : (
                    <span className="font-medium">{type.name}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  {editTypeId === type.id ? (
                    <>
                      <button
                        onClick={() => handleEditType(type.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditTypeId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditTypeId(type.id);
                          setEditTypeName(type.name);
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteType(type.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================== Box 2: View Products ================== */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h3 className="text-2xl font-semibold text-green-700 mb-4">📦 Vendor Products</h3>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-6">
            {productTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full border ${
                  selectedType?.id === type.id
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-green-700 hover:bg-green-100"
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>

          {/* Product Display */}
          {selectedType ? (
            filteredProducts.length === 0 ? (
              <p className="text-gray-600 text-center">
                No products found for this category.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="cursor-pointer border rounded-lg shadow-sm p-4 hover:shadow-md transition"
                  >
                    <img
                      src={product.imageUrl || "https://via.placeholder.com/150"}
                      alt={product.productName}
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                    <h4 className="font-semibold text-lg text-green-700">
                      {product.productName}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Price: ₹{product.price}
                    </p>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                        product.active
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {product.active ? "Active" : "Disabled"}
                    </span>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-gray-600 text-center">Select a category to view products</p>
          )}
        </div>
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-11/12 md:w-2/3 relative">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={selectedProduct.imageUrl || "https://via.placeholder.com/200"}
                alt={selectedProduct.productName}
                className="w-full md:w-1/3 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-2xl font-semibold text-green-700 mb-2">
                  {selectedProduct.productName}
                </h3>
                <p className="text-gray-700 mb-1">
                  <strong>Category:</strong> {selectedProduct.productType}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Price:</strong> ₹{selectedProduct.price}
                </p>
                <p className="text-gray-700 mb-3">
                  <strong>Description:</strong> {selectedProduct.description}
                </p>
                <button
                  onClick={() =>
                    toggleProductStatus(selectedProduct.id, selectedProduct.active)
                  }
                  className={`mt-3 px-4 py-2 rounded text-white ${
                    selectedProduct.active
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {selectedProduct.active ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
