import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BuyerProductDetails = ({ product, onClose, onCartUpdate }) => {
  if (!product) return null;

  const [activeTab, setActiveTab] = useState("About");
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const navigate = useNavigate();
  const buyerId = localStorage.getItem("buyerId");
  const token = localStorage.getItem("token");
  const BASE_URL = "http://localhost:8082";

  const productId = product.id || product.productId;
  const tabs = ["About", "Composition", "Reviews", "Vendor"];

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // ✅ Fetch reviews
  const fetchReviews = async () => {
    if (!productId) return;
    try {
      setLoadingReviews(true);
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get(
        `${BASE_URL}/api/reviews/product/${productId}`,
        { headers }
      );
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, token]);

  // ✅ Add a new review
  const handleAddReview = async () => {
    if (!buyerId || !token) {
      alert("⚠️ Please login to post a review.");
      navigate("/buyer/login");
      return;
    }
    if (!newComment.trim() || rating === 0) {
      alert("⚠️ Please provide both rating and comment.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/reviews/add/${productId}`,
        { rating, comment: newComment.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Review posted successfully!");
      setNewComment("");
      setRating(0);
      fetchReviews(); // refresh list
    } catch (err) {
      console.error("❌ Error posting review:", err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        alert("⚠️ Session expired. Please login again.");
        navigate("/buyer/login");
      } else {
        alert("❌ Failed to post review. Try again later.");
      }
    }
  };

  // ✅ Add to cart
  const handleAddToCart = async () => {
    if (!buyerId || !token) {
      alert("⚠️ Please login to add items to your cart.");
      navigate("/buyer/login");
      return;
    }

    try {
      const { data: existingCart } = await axios.get(
        `${BASE_URL}/api/cart/${buyerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const cartItems = Array.isArray(existingCart) ? existingCart : [];
      const existingItem = cartItems.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        await axios.put(
          `${BASE_URL}/api/cart/update/${existingItem.id}?quantity=${
            existingItem.quantity + 1
          }`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("🛒 Quantity updated in your cart!");
      } else {
        await axios.post(
          `${BASE_URL}/api/cart/add`,
          {
            buyerId: parseInt(buyerId),
            productId,
            productName: product.productName,
            price: product.price,
            quantity: 1,
            vendorId: product.vendorId || null,
            imageUrl: product.imageUrl || "",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("✅ Product added to cart!");
      }

      onCartUpdate?.();
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
      if (err.response?.status === 401) {
        alert("⚠️ Session expired. Please login again.");
        navigate("/buyer/login");
      } else {
        alert("❌ Failed to add product to cart. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden sm:max-w-lg md:max-w-xl">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg sm:text-xl font-semibold text-emerald-700">
            {product.productName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Product Image */}
        <div className="flex justify-center bg-gray-100 p-4">
          <img
            src={product.imageUrl || "https://via.placeholder.com/150"}
            alt={product.productName}
            className="h-52 sm:h-60 object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="px-5 space-y-2">
          <p className="text-gray-500 text-sm mt-2">
            Brand: {product.brandName || "AgriTech Solutions"}
          </p>
          <p className="text-2xl font-bold text-emerald-700">₹{product.price}</p>
          <p className="text-gray-600 text-sm">1 kilogram</p>

          <div className="mt-3 bg-gray-50 rounded-lg p-3 border">
            <p className="text-gray-700 text-sm font-medium">
              Sold by:{" "}
              <span className="font-semibold text-gray-800">
                {product.vendorName || "N/A"}
              </span>
            </p>
            {product.vendorMobile && (
              <p className="text-sm text-blue-600">📞 +91 {product.vendorMobile}</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 mt-4">
          <nav className="flex justify-around text-xs sm:text-sm font-medium">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 flex-1 ${
                  activeTab === tab
                    ? "text-emerald-700 border-b-2 border-emerald-700"
                    : "text-gray-500 hover:text-emerald-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-5 text-gray-700 text-sm space-y-3">
          {/* About Tab */}
          {activeTab === "About" && (
            <>
              <h3 className="font-semibold text-gray-800">About Product</h3>
              <p>{product.aboutProduct || "No description available."}</p>
              <p>
                <b>Country of Origin:</b> India
              </p>
              <p className="text-gray-500 text-xs mt-3">
                🚫 Not cancellable | 🚫 Not returnable
              </p>
            </>
          )}

          {/* Composition Tab */}
          {activeTab === "Composition" && (
            <>
              <h3 className="font-semibold text-gray-800">
                Composition & Usage
              </h3>
              <p>
                <b>Active Ingredient:</b>{" "}
                {product.activeIngredient || "Dimethomorph 50% WP"}
              </p>
              <p>
                <b>Effective Against:</b>{" "}
                {product.effectiveAgainst || "Fungal diseases"}
              </p>
              <p>
                <b>Dosage:</b> {product.dosage || "1 gm per litre of water"}
              </p>
              <p>
                <b>Benefits:</b>{" "}
                {product.benefits ||
                  "Highly effective fungicide for preventive and curative action."}
              </p>
              <p>
                <b>Expiry Date:</b> {formatDate(product.expiryDate)}
              </p>
            </>
          )}

          {/* Reviews Tab */}
          {activeTab === "Reviews" && (
            <>
              <h3 className="font-semibold text-gray-800 mb-2">
                Ratings & Reviews
              </h3>

              {/* Rating Input */}
              <div className="flex items-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition ${
                      rating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-gray-600">
                  {rating ? `${rating} / 5` : "No rating yet"}
                </span>
              </div>

              {/* Review List */}
              {loadingReviews ? (
                <p>Loading reviews...</p>
              ) : reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                reviews.map((r, i) => (
                  <div
                    key={i}
                    className="border-b pb-2 mb-2 text-gray-700 space-y-1"
                  >
                    <p className="font-semibold text-emerald-700">
                      ⭐ {r.rating} / 5
                    </p>
                    <p>{r.comment}</p>
                    <p className="text-xs text-gray-400">
                      — {r.buyerName || "Unknown Buyer"}, {formatDate(r.createdAt)}
                    </p>
                  </div>
                ))
              )}

              {/* Add Review */}
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 border rounded-md px-3 py-2"
                />
                <button
                  onClick={handleAddReview}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-500"
                >
                  Post
                </button>
              </div>
            </>
          )}

          {/* Vendor Tab */}
          {activeTab === "Vendor" && (
            <>
              <h3 className="font-semibold text-gray-800 mb-2">
                Vendor Details
              </h3>
              <p>
                <b>Name:</b> {product.vendorName || "N/A"}
              </p>
              <p>
                <b>Email:</b> {product.vendorEmail || "N/A"}
              </p>
              <p>
                <b>Mobile:</b> {product.vendorMobile || "N/A"}
              </p>
              <p>
                <b>Address:</b> {product.vendorAddress || "N/A"}
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex flex-col sm:flex-row justify-between items-center p-4 border-t bg-white shadow-md gap-2">
          <div className="text-center sm:text-left">
            <p className="font-bold text-xl text-emerald-700">
              ₹{product.price}
            </p>
            <p className="text-gray-500 text-xs">1 kilogram</p>
          </div>

          <div className="flex w-full sm:w-auto gap-2">
            <button
              onClick={() =>
                navigate(`/buyer/place-orders?productId=${productId}`)
              }
              className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-emerald-700 text-white hover:bg-emerald-600 font-medium"
            >
              Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              className="flex-1 sm:flex-none px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerProductDetails;
