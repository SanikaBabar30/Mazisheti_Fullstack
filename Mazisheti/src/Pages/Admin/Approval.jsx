import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Approval = () => {
  const [farmers, setFarmers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchFarmers();
  }, [token]);

  const fetchFarmers = async () => {
    if (!token) {
      setError("Unauthorized. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:8082/api/admin/farmers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFarmers(res.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching farmers");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, fullName) => {
    try {
      await axios.put(
        `http://localhost:8082/api/admin/approve/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Approved: ${fullName}`);
      fetchFarmers(); // 🔄 Refresh after approval
    } catch (err) {
      toast.error("Failed to approve farmer.");
    }
  };

  const confirmApprove = (farmer) => {
    setSelectedFarmer(farmer);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (selectedFarmer) {
      handleApprove(selectedFarmer.id, selectedFarmer.fullName);
      setShowModal(false);
    }
  };

  const filteredFarmers = farmers.filter((farmer) =>
    farmer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-700">Farmer Approval Panel</h1>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {loading && <p className="text-gray-600 text-center">Loading farmers...</p>}

        {!loading && (
          <>
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredFarmers.length === 0 ? (
              <p className="text-center text-gray-600">No farmers found.</p>
            ) : (
              <div className="space-y-4">
                {filteredFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-lg text-green-800">{farmer.fullName}</p>
                      <p className="text-gray-600 text-sm">{farmer.email}</p>
                      <p className="text-sm mt-1 font-semibold text-gray-500">Status: {farmer.status}</p>
                    </div>
                    {farmer.status === "PENDING" ? (
                      <button
                        onClick={() => confirmApprove(farmer)}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-green-700 font-bold">Approved</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ✅ Confirmation Modal */}
      {showModal && selectedFarmer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-11/12 max-w-md">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Confirm Approval</h2>
            <p className="text-center mb-6">
              Are you sure you want to approve{" "}
              <strong className="text-green-700">{selectedFarmer.fullName}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Yes, Approve
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approval;
