import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiPackage } from "react-icons/fi";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("category");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token");

  const fetchVendorProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: vendorData } = await axios.get(
        "http://localhost:8082/api/vendors/by-email",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { email },
        }
      );
      const vendorId = vendorData.id;
      localStorage.setItem("vendorId", vendorId);

      const { data: productsData } = await axios.get(
        `http://localhost:8082/api/products/vendor/${vendorId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(productsData || []);
    } catch (err) {
      setError("Error fetching products. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [email, token]);

  useEffect(() => {
    if (email && token) fetchVendorProducts();
  }, [email, token, fetchVendorProducts]);

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8082/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(products.filter((p) => p.id !== productId));
      } catch (err) {
        alert("Error deleting product. Please try again later.");
        console.error(err);
      }
    }
  };

  const groupedProducts = useCallback(() => {
    return products.reduce((acc, product) => {
      const type = product.productType || "Uncategorized";
      if (!acc[type]) acc[type] = [];
      acc[type].push(product);
      return acc;
    }, {});
  }, [products]);

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading products...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  const grouped = groupedProducts();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-3xl font-bold text-emerald-700">My Products</h2>
        <button
          onClick={() => navigate("/vendor/add-product")}
          className="mt-3 sm:mt-0 bg-emerald-600 hover:bg-green-600 transition-colors text-white px-4 py-2 rounded-lg shadow"
        >
          + Add Product
        </button>
      </div>

      {/* Total Products */}
      <div className="bg-emerald-100 text-emerald-800 px-5 py-3 rounded-lg shadow-md mb-6 inline-block border border-emerald-300">
        <strong>Total Products:</strong> {products.length}
      </div>

      {/* No Products */}
      {products.length === 0 ? (
        <div className="text-center mt-10">
          <FiPackage className="mx-auto text-emerald-500 text-6xl mb-4" />
          <p className="text-gray-500 text-lg font-semibold">No products found</p>
          <p className="text-gray-400">Start by adding your first product above!</p>
        </div>
      ) : view === "category" ? (
        // Category View
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {Object.keys(grouped).map((category) => (
            <div
              key={category}
              className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center border hover:shadow-lg transition"
            >
              <div className="w-24 h-24 flex items-center justify-center rounded-full border-4 border-emerald-600 mb-4 overflow-hidden">
                <img
                  src={grouped[category][0].imageUrl || "/placeholder.png"}
                  alt={category}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-emerald-700">{category}</h3>
              <button
                onClick={() => {
                  setSelectedCategory(category);
                  setView("list");
                }}
                className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700 transition"
              >
                View Products
              </button>
            </div>
          ))}
        </div>
      ) : (
        // List View
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-emerald-700">
              {selectedCategory} Products
            </h3>
            <button
              onClick={() => setView("category")}
              className="bg-emerald-100 text-emerald-800 px-5 py-3 rounded-lg shadow-md mb-6 inline-block border border-emerald-300"
            >
              ← Back to Categories
            </button>
          </div>

          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="w-full text-sm border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-emerald-100 text-emerald-800 font-bold text-xs uppercase">
                  {[
                    "Image",
                    "Product Name",
                    "Brand",
                    "About",
                    "Active Ingredient",
                    "Effective Against",
                    "Target Crops",
                    "Dosage",
                    "Benefits",
                    "Packing Size",
                    "Batch No.",
                    "Price",
                    "Stock",
                    "Available",
                    "Release Date",
                    "Expiry Date",
                    "Category",
                    "Actions",
                  ].map((th) => (
                    <th key={th} className="p-3 text-left border-b border-emerald-300">
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grouped[selectedCategory]?.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-3">
                      <img
                        src={p.imageUrl || "/placeholder.png"}
                        alt={p.productName}
                        className="h-16 w-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-3 font-semibold">{p.productName}</td>
                    <td className="p-3">{p.brandName}</td>
                    <td className="p-3">{p.aboutProduct}</td>
                    <td className="p-3">{p.activeIngredient}</td>
                    <td className="p-3">{p.effectiveAgainst}</td>
                    <td className="p-3">{p.targetCrops}</td>
                    <td className="p-3">{p.dosage}</td>
                    <td className="p-3">{p.benefits}</td>
                    <td className="p-3">{p.packingSize}</td>
                    <td className="p-3">{p.batchNumber}</td>
                    <td className="p-3 text-green-600 font-semibold">₹{p.price}</td>
                    <td className="p-3">{p.stockQuantity}</td>
                    <td className="p-3">
                      {p.available ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                          No
                        </span>
                      )}
                    </td>
                    <td className="p-3">{p.releaseDate}</td>
                    <td className="p-3">{p.expiryDate}</td>
                    <td className="p-3">{p.productType}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => navigate(`/vendor/edit-product/${p.id}`)}
                        className="bg-emerald-700 hover:bg-emerald-400 text-white px-3 py-1 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProducts;
