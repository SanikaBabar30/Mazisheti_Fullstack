import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BuyerProductDetails from "./BuyerProductDetails"; // full-page product details
import { Store, User, Phone, Mail, MapPin } from "lucide-react"; // icons

const Marketplace = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null); // for full-page details
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");
  const buyerId = localStorage.getItem("buyerId");
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:8082";

  // ✅ Ensure all images resolve properly
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    return path.startsWith("http") ? path : `${BASE_URL}/${path}`;
  };

  // ✅ Fetch categories when component mounts
  useEffect(() => {
    if (!token) return;
    fetch(`${BASE_URL}/api/admin/product-types`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) fetchProducts(data[0].name);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, [token]);

  // ✅ Fetch products by category
  const fetchProducts = (categoryName) => {
    if (!token) return;
    fetch(`${BASE_URL}/api/products/category/${categoryName}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((p) => ({
          id: p.productId || p.id, // ✅ FIXED key mapping
          productName: p.productName,
          brandName: p.brandName,
          vendor: p.vendor || null,
          vendorName: p.vendor?.shopName || "Admin",
          vendorEmail: p.vendor?.email || "N/A",
          vendorMobile: p.vendor?.mobileNumber || "N/A",
          vendorAddress: p.vendor?.shopAddress || "N/A",
          price: p.price,
          imageUrl: getImageUrl(p.image || p.imageUrl || p.productImage),
          targetCrops: p.targetCrops || "",
          aboutProduct: p.aboutProduct || "",
          activeIngredient: p.activeIngredient || "",
          effectiveAgainst: p.effectiveAgainst || "",
          dosage: p.dosage || "",
          benefits: p.benefits || "",
          packingSize: p.packingSize || "",
          batchNumber: p.batchNumber || "",
          stockQuantity: p.stockQuantity || 0,
          releaseDate: p.releaseDate,
          expiryDate: p.expiryDate,
          available: p.available ?? true,
        }));
        setProducts(mapped);
        setFilteredProducts(mapped);
        setSelectedCategory(categoryName);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProducts([]);
        setFilteredProducts([]);
      });
  };

  // ✅ Search products
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredProducts(
      products.filter(
        (p) =>
          p.productName.toLowerCase().includes(query) ||
          (p.brandName && p.brandName.toLowerCase().includes(query)) ||
          (p.targetCrops && p.targetCrops.toLowerCase().includes(query))
      )
    );
  };

  // ✅ Add to cart
  const handleAddToCart = async (product) => {
    if (!buyerId) {
      alert("Please log in to add items to your cart.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/cart/add`,
        {
          buyerId,
          productId: product.id, // ✅ consistent id
          productName: product.productName,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("✅ Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add item to cart.");
    }
  };

  // ✅ Go to cart page
  const handleGoToCart = () => {
    navigate("/buyer/cart");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* 🔍 Search bar */}
      <input
        type="text"
        placeholder="Search by product, brand, crop..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-700"
      />

      {/* 🏷️ Categories */}
      <div className="flex space-x-4 overflow-x-auto py-2 mb-8 scrollbar-hide">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => fetchProducts(cat.name)}
            className="flex flex-col items-center cursor-pointer min-w-[80px] flex-shrink-0"
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition ${
                selectedCategory === cat.name ? "border-2 border-green-500" : ""
              }`}
            >
              <img
                src={getImageUrl(cat.image || cat.imageUrl)}
                alt={cat.name}
                className="w-12 h-12 object-contain"
              />
            </div>
            <p className="text-xs mt-2 font-medium text-center">{cat.name}</p>
          </div>
        ))}
      </div>

      {/* 🛒 Products Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition flex flex-col"
            >
              <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={p.imageUrl}
                  alt={p.productName}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="font-semibold text-sm mb-1">{p.productName}</h3>
                <p className="text-xs text-gray-400 mb-1">Brand: {p.brandName}</p>
                <p className="text-xs text-gray-400 mb-2">Crops: {p.targetCrops}</p>
                <p className="text-xs text-gray-600 mb-2">Sold by: {p.vendorName}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <span className="font-bold text-emerald-700 text-lg">
                    ₹{p.price}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="bg-emerald-700 text-white px-3 py-1 rounded-lg text-sm hover:bg-emerald-600 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🧾 Full-page Product Details */}
      {selectedProduct && (
        <BuyerProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* 🛍️ Cart Access Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleGoToCart}
          className="bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg hover:bg-emerald-600 transition"
        >
          Go to Cart 🛒
        </button>
      </div>
    </div>
  );
};

export default Marketplace;
