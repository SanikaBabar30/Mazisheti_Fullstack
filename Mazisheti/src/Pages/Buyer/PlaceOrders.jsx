import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PlaceOrders = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cartFromState = location.state?.cartItems || [];
  const [cartItems, setCartItems] = useState(cartFromState);

  const [buyerInfo, setBuyerInfo] = useState({ name: "", phone: "", address: "" });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  // Update quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity } : item));
  };

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleChange = (e) => {
    setBuyerInfo({ ...buyerInfo, [e.target.name]: e.target.value });
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const handleOrder = () => {
    if (!buyerInfo.name || !buyerInfo.address || !buyerInfo.phone) {
      alert("Please fill all required fields");
      return;
    }
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }
    setLoading(true);

    // Example API call
    fetch("http://localhost:8082/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerInfo, paymentMethod, cartItems, totalAmount }),
    })
      .then(res => res.json())
      .then(() => {
        setLoading(false);
        alert("Order placed successfully!");
        navigate("/buyer-dashboard");
      })
      .catch(err => {
        setLoading(false);
        alert("Failed to place order. Try again!");
        console.error(err);
      });
  };

  return (
    <div className="p-5 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Cart Module */}
      <div>
        <h2 className="font-bold mb-2">Cart Items</h2>
        {cartItems.length === 0 ? (
          <p className="text-gray-500">No products selected.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-2 border p-2 rounded">
              <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded" />
              <span>{item.productName}</span>
              <div>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span className="mx-2">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <span>₹{item.price * item.quantity}</span>
              <button onClick={() => removeItem(item.id)} className="text-red-500">Remove</button>
            </div>
          ))
        )}
        <hr className="my-2" />
        <h3 className="font-semibold">Total: ₹{totalAmount}</h3>
      </div>

      {/* Shipping + Payment Module */}
      <div className="flex flex-col gap-4">
        {/* Shipping Info */}
        <div>
          <h2 className="font-bold mb-2">Buyer Info</h2>
          <input
            name="name"
            placeholder="Name"
            value={buyerInfo.name}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={buyerInfo.phone}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            name="address"
            placeholder="Address"
            value={buyerInfo.address}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
          />
        </div>

        {/* Payment */}
        <div>
          <h2 className="font-bold mb-2">Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="border p-2 mb-2 w-full"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="Online">Online Payment</option>
          </select>
          <button
            onClick={handleOrder}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrders;
