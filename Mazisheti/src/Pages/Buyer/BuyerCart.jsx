import React, { useEffect, useState } from "react";
import axios from "axios";

const BuyerCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const buyerId = localStorage.getItem("buyerId");
  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:8082";

  useEffect(() => {
    if (!buyerId || !token) {
      setError("⚠️ Please login first to view your cart.");
      setLoading(false);
      return;
    }
    fetchCartItems();
  }, [buyerId, token]);

  const fetchCartItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/cart/${buyerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = Array.isArray(res.data) ? res.data : [];
      setCartItems(items);
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch cart data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    if (!window.confirm("🗑️ Remove this item from your cart?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("❌ Error removing item:", err);
      alert(err.response?.data?.message || "Failed to remove item.");
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put(
        `${BASE_URL}/api/cart/update/${id}?quantity=${quantity}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (err) {
      console.error("❌ Error updating quantity:", err);
      alert(err.response?.data?.message || "Failed to update quantity.");
    }
  };

  const handleCheckout = (item) => {
    setSelectedItem(item);
  };

  const confirmCheckout = () => {
    setSelectedItem(null);
    window.location.href = `/buyer/place-orders`;
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 font-medium mt-6">{error}</p>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl sm:text-3xl font-semibold text-emerald-700 mb-6 flex items-center gap-2">
        🛒 Your Shopping Cart
      </h2>

      {cartItems.length === 0 ? (
        <div className="text-center text-gray-500 p-8 sm:p-10 bg-white rounded-lg shadow-sm">
          <p className="text-lg">Your cart is empty.</p>
          <p className="text-sm mt-2">Add items from the product list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-2xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col"
            >
              {/* 🖼 Product Image (Fixed Display) */}
              <div className="h-48 w-full flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.imageUrl || "https://via.placeholder.com/200"}
                  alt={item.productName}
                  className="max-h-44 max-w-full object-contain"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/200")
                  }
                />
              </div>

              {/* 📝 Product Info */}
              <div className="flex-1 mt-3">
                <h3 className="font-semibold text-gray-800 text-lg truncate">
                  {item.productName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Price: ₹{item.price}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <label className="text-sm text-gray-500">Qty:</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    className="w-16 p-1 border rounded-md text-center focus:ring-emerald-400 focus:border-emerald-400"
                  />
                </div>

                <p className="mt-3 font-semibold text-emerald-700">
                  Total: ₹{item.price * item.quantity}
                </p>
              </div>

              {/* 🔘 Actions */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 font-medium text-sm"
                >
                  Remove
                </button>
                <button
                  onClick={() => handleCheckout(item)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition text-sm"
                >
                  Checkout →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Checkout Modal */}
      {selectedItem && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-t-2xl sm:rounded-lg shadow-lg w-full sm:w-96 text-center animate-slideUp">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Confirm Checkout
            </h2>
            <p className="text-gray-600 mb-5">
              Proceed to checkout for{" "}
              <span className="font-medium text-emerald-700">
                {selectedItem.productName}
              </span>{" "}
              — ₹{selectedItem.price * selectedItem.quantity}?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmCheckout}
                className="px-5 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition"
              >
                Confirm →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔄 Slide Animation */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BuyerCart;
