import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cropsData = {
  grains: [
    { name: "rice", icon: "🍚" },
    { name: "sorghum", icon: "🌾" },
    { name: "corn", icon: "🌽" },
    { name: "wheat", icon: "🌾" },
  ],
  fruits: [
    { name: "strawberry", icon: "🍓" },
    { name: "sugarcane", icon: "🍬" },
    { name: "watermelon", icon: "🍉" },
  ],
};

const medicinesByCrop = {
  rice: [
    { name: "Carbofuran", price: "1,500/Kg", image: "/Images/Carbofuran.jpg" },
    { name: "Triazophos", price: "₹495/Litre", image: "/Images/triazophos.jpg" },
    { name: "Quinalphos ", price: "₹700/Litre", image: "/Images/quinalphos.jpg" },
    { name: "Deltamethrin ", price: "₹803/Litre", image: "/Images/Deltamethrin.webp" },
  ],
  sorghum: [
    { name: "Imidaclopride ", price: "₹1,500/Kg", image: "/Images/Imidaclopride.png" },
    { name: "Carbaryl(50 WP)", price: "₹500/Kg", image: "/Images/Carbaryl.jpg" },
    { name: "Atrazine ", price: "₹300/Kg", image: "/Images/atrazine.webp" },
    { name: "Neem Oil", price: "₹ 1,500/Kg", image: "/Images/Neem Oil.webp" },
  ],
  corn: [
    { name: "Herbicides", price: "₹500/Litre", image: "/Images/herbicides1.jpg" },
    { name: "Chemicalpesticides", price: "₹200/Litre", image: "/Images/chemicalpesticides.webp" },
    { name: "Pesticides", price: "₹330/Litre", image: "/Images/pesticides.webp" },
   
  ],
  wheat: [
    { name: "Pedimethalin", price: "₹2,000/Kg", image: "/Images/Pedimethalin.jpg" },
    { name: "Carbendazim", price: "₹400/Kg", image: "/Images/Carbendazim.webp" },
    { name: "Chlropyrifos", price: "₹1,000/Kg", image: "/Images/Chlropyrifos.jpg" },
    { name: "Propiconazole", price: "₹800/Kg", image: "/Images/Tebuconazole.jpg" },
  ],
  strawberry: [
    { name: "Abamectin", price: "₹460/Litre", image: "/Images/Abamectin1.webp" },
    { name: "Glyphosate", price: "₹500/Litre", image: "/Images/Glyphosate.jpg" },
    { name: "Mancozeb", price: "₹571/kg", image: "/Images/Mancozeb.jpg" },
    { name: "Spinosad", price: "₹500/Litre", image: "/Images/spinosad.jpg" },
  ],
  sugarcane: [
    { name: "Atrazine ", price: "₹300/Kg", image: "/Images/atrazine.webp" },
    { name: "Glyphosate", price: "₹500/Litre", image: "/Images/Glyphosate.jpg" },
    { name: "Imidacloprid", price: "₹450/Litre", image: "/Images/imidacloprid.webp" },
    
  ],
  watermelon: [
    { name: "Biopesticides", price: "₹800/Litre", image: "/Images/Biopesticides.webp" },
    { name: "chlorothalonil ", price: "₹270/kg", image: "/Images/chlorothalonil.avif" },
    { name: "Metribuzin 70%", price: "₹900Litre", image: "/Images/Metribuzin-70-WDG-Herbicide.webp" },
   
  ],
};

const CropMedicines = () => {
  const [selectedCategory, setSelectedCategory] = useState("grains");
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form inputs state
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");

  const handleBuyNow = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handlePayment = (e) => {
    e.preventDefault();

    const purchase = {
      crop: selectedCrop,
      medicine: selectedItem.name,
      price: selectedItem.price,
      date: new Date().toLocaleString(),
      customerName: name,
      mobileNumber: mobile,
      address: address,
    };

    const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
    purchases.push(purchase);
    localStorage.setItem("purchases", JSON.stringify(purchases));

    toast.success(`Payment successful for ${selectedItem.name}!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setShowModal(false);
    // Clear form inputs
    setName("");
    setMobile("");
    setAddress("");
  };

  const handlePrint = () => {
    const content = document.querySelector("table").outerHTML;
    const newWindow = window.open();
    newWindow.document.write(`
      <html>
        <head><title>Receipt</title></head>
        <body>
          <h2>🧾 Crop Medicine Purchase Receipt</h2>
          ${content}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="w-full min-h-screen py-10 px-6">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-emerald-700 mb-10">
          Pesticide & Medicines
        </h1>

        {!selectedCrop ? (
          <>
            {/* Category Tabs */}
            <div className="flex justify-center gap-6 mb-8">
              {Object.keys(cropsData).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 text-lg rounded-full font-semibold capitalize transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-white text-emerald-700 border border-emerald-400 hover:bg-emerald-500 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Crop Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {cropsData[selectedCategory].map(({ name, icon }) => (
                <div
                  key={name}
                  onClick={() => setSelectedCrop(name)}
                  className="cursor-pointer flex flex-col items-center justify-center border border-emerald-300 p-12 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[280px]"
                >
                  <div className="text-8xl mb-3">{icon}</div>
                  <p className="capitalize font-bold text-emerald-800 text-xl">{name}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => setSelectedCrop(null)}
              className="mb-6 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-gray-800"
            >
              ← Back to Crops
            </button>

            {/* Medicines List */}
            <h2 className="text-3xl font-semibold capitalize mb-6 text-emerald-800">
              Medicines for {selectedCrop}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {(medicinesByCrop[selectedCrop] || []).map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-emerald-100 rounded-lg p-4 shadow hover:shadow-xl transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover mb-3 mx-auto rounded"
                  />
                  <h3 className="text-xl font-semibold text-center text-emerald-800">{item.name}</h3>
                  <p className="text-center text-green-600 font-bold">{item.price}</p>
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="mt-4 block mx-auto bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>

            {/* Purchase Table */}
            {localStorage.getItem("purchases") && (
              <div className="mt-10 bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-emerald-700 mb-4">🧾 Recent Purchases</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border">
                    <thead>
                      <tr className="bg-emerald-100">
                        <th className="p-2 border">Crop</th>
                        <th className="p-2 border">Medicine</th>
                        <th className="p-2 border">Price</th>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Mobile</th>
                        <th className="p-2 border">Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {JSON.parse(localStorage.getItem("purchases")).map((item, i) => (
                        <tr key={i} className="hover:bg-emerald-50">
                          <td className="p-2 border capitalize">{item.crop}</td>
                          <td className="p-2 border">{item.medicine}</td>
                          <td className="p-2 border">{item.price}</td>
                          <td className="p-2 border">{item.date}</td>
                          <td className="p-2 border">{item.customerName}</td>
                          <td className="p-2 border">{item.mobileNumber}</td>
                          <td className="p-2 border">{item.address}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={handlePrint}
                  className="mt-4 bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                >
                  Print / Download Receipt
                </button>
              </div>
            )}
          </>
        )}

        {/* Payment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-emerald-700">Confirm Purchase</h3>
              <p className="mb-4">
                Are you sure you want to buy <strong>{selectedItem.name}</strong> for{" "}
                <strong>{selectedItem.price}</strong>?
              </p>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. +1234567890"
                    pattern="^\+?\d{7,15}$"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Address</label>
                  <textarea
                    placeholder="Your Address"
                    required
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    Pay {selectedItem.price}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropMedicines;
