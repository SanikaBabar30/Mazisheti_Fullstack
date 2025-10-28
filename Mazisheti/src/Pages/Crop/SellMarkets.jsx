import React from "react";

const cropSalePoints = [
  {
    marketName: "Sangli Agro Market Yard",
    location: "Sangli, Maharashtra",
    contact: "Market Office: 0233-1234567",
    image: "/Images/image4.jpg",
  },
  {
    marketName: "Shetkari Mart",
    location: "Kolhapur, Maharashtra",
    contact: "Enquiry: 0231-7654321",
    image: "/Images/shetkarimart.jpg",
  },
  {
    marketName: "Tasgaon Grape Mandi",
    location: "Tasgaon, Sangli",
    contact: "Manager: 0234-8888877",
    image: "/Images/image3.jpg",
  },
];

const cropSpecialists = [
  {
    name: "Dr. Pooja Sawant",
    phone: "9876543210",
    crops: ["Wheat", "Rice"],
  },
  {
    name: "Ms. Arjun Kadam",
    phone: "9123456780",
    crops: ["Sugarcane"],
  },
  {
    name: "Mr. Jaydip Patil",
    phone: "9988776655",
    crops: ["Corn", "Sorghum"],
  },
  {
    name: "Ms. Abhishek Punekar",
    phone: "9876512345",
    crops: ["Sugarcane", "Watermelon"],
  },
  {
    name: "Dr. Shumbham Matkari",
    phone: "9900990011",
    crops: ["Strawberry", "Grapes"],
  },
  {
    name: "Mr. Vijay Jadhav",
    phone: "9765432109",
    crops: ["Sugarcane"],
  },
];

const SellMarkets = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Updated Market Section Heading */}
      <h2 className="text-4xl font-extrabold text-emerald-700 text-center mb-12">
        🛒 Stores Nearby
      </h2>

      {/* Market Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
        {cropSalePoints.map((market, index) => (
          <div
            key={index}
            className="bg-white border border-gray-300 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
          >
            <img
              src={market.image}
              alt={market.marketName}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {market.marketName}
              </h3>
              <p className="text-gray-700 mb-1">
                <strong>📍 Location:</strong> {market.location}
              </p>
              <p className="text-gray-700">
                <strong>📞 Contact:</strong> {market.contact}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Specialists Section */}
      <h2 className="text-3xl font-bold text-center text-emerald-800 mb-8">
        👩‍🌾 Crop Specialists
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cropSpecialists.map((spec, i) => (
          <div
            key={i}
            className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 shadow-md"
          >
            <h4 className="text-xl font-semibold text-gray-800">{spec.name}</h4>
            <p className="text-gray-600 mb-2">
              📞{" "}
              <a href={`tel:${spec.phone}`} className="text-emerald-700 hover:underline">
                {spec.phone}
              </a>
            </p>
            <p className="text-sm text-gray-700 mb-1">
              🌱 <strong>Guides:</strong> {spec.crops.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellMarkets;
