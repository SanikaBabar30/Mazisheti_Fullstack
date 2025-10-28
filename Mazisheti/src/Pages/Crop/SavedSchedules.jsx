import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isSameDay, isBefore, parseISO } from "date-fns";
import { FaSeedling, FaChevronLeft } from "react-icons/fa";

const SavedSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const farmerId = localStorage.getItem("farmerId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!farmerId || !token) {
      toast.error("User not authenticated. Please log in.");
      navigate("/login");
      return;
    }
    axios
      .get(`http://localhost:8082/api/schedules/farmer/${farmerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSchedules(res.data))
      .catch(() => toast.error("Failed to load schedules."))
      .finally(() => setLoading(false));
  }, [farmerId, token, navigate]);

  const groupByCrop = (schedules) => {
    const grouped = {};
    schedules.forEach((s) => {
      const cropName = s.cropName || "Unknown Crop";
      if (!grouped[cropName]) {
        grouped[cropName] = { image: s.cropImage || null, items: [] };
      }
      grouped[cropName].items.push(s);
    });
    return grouped;
  };

  const getRowStyle = (startDate, endDate) => {
    const today = new Date();
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    if (isSameDay(today, start) || isSameDay(today, end) || (isBefore(start, today) && isBefore(today, end))) {
      return "bg-green-50 border-green-500 hover:bg-green-100";
    }
    if (isBefore(end, today)) {
      return "bg-gray-200 border-gray-400 hover:bg-gray-300";
    }
    return "bg-green-50 border-green-400 hover:bg-green-100";
  };

  const groupedSchedules = groupByCrop(schedules);

  return (
    <div className="w-full px-6 py-10">
      <h2 className="text-3xl font-semibold text-emerald-700 text-center mb-8 flex items-center justify-center gap-3">
        <FaSeedling className="text-emerald-600" size={32} />
        Saved Crop Schedules
      </h2>

      <div className="text-center mb-6">
        <button
          onClick={() => navigate("/crop/selection")}
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all flex items-center gap-2"
        >
          <FaChevronLeft />
          Back to Crop Selection
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-emerald-500"></div>
        </div>
      ) : Object.keys(groupedSchedules).length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">No schedules saved yet. Start by generating one!</p>
      ) : (
        Object.entries(groupedSchedules).map(([cropName, { image, items }], idx) => (
          <div
            key={idx}
            className="mb-10 rounded-lg shadow-lg overflow-hidden border hover:shadow-2xl transition"
          >
            {image && (
              <div className="relative w-full h-48">
                <img src={image} alt={cropName} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-3">
                  <h3 className="text-white text-xl font-semibold">{cropName}</h3>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-emerald-600 text-white uppercase text-left shadow-md">
                  <tr>
                    <th className="px-6 py-4 border-b font-medium text-lg">Stage</th>
                    <th className="px-6 py-4 border-b font-medium text-lg">Start Date</th>
                    <th className="px-6 py-4 border-b font-medium text-lg">End Date</th>
                    <th className="px-6 py-4 border-b font-medium text-lg">Activities</th>
                    <th className="px-6 py-4 border-b font-medium text-lg">Pesticides</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr
                      key={i}
                      className={`${getRowStyle(item.startDate, item.endDate)} border-t hover:bg-emerald-50 transition-all`}
                    >
                      <td className="px-6 py-3 border-b">{item.stage}</td>
                      <td className="px-6 py-3 border-b">{item.startDate}</td>
                      <td className="px-6 py-3 border-b">{item.endDate}</td>
                      <td className="px-6 py-3 border-b">{item.activities}</td>
                      <td className="px-6 py-3 border-b">{item.pesticides || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedSchedules;
