import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-toastify";
import { FaInfoCircle } from "react-icons/fa";

const Schedule = () => {
  const { farmerId, cropId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const cropName = location.state?.cropName || "Unknown Crop";
  const seedType = location.state?.seedType || "N/A";
  const quantity = location.state?.quantity || 1;

  const [plantingDate, setPlantingDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [schedule, setSchedule] = useState([]);
  const [regenerate, setRegenerate] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if missing params
  useEffect(() => {
    if (!cropId || !farmerId) {
      toast.error("Missing crop or farmer information. Redirecting...");
      navigate("/crop/selection");
    }
  }, [cropId, farmerId, navigate]);

  // Generate schedule
  const generateSchedule = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to continue.");
      navigate("/login");
      return;
    }

    if (!plantingDate) {
      toast.error("Select a planting date.");
      return;
    }

    try {
      setLoading(true);
      console.log("Generating schedule:", { plantingDate, overwrite: regenerate });

      const requestBody = { plantingDate, overwrite: regenerate };

      const response = await axios.post(
        `http://localhost:8082/api/schedules/generate/${farmerId}/${cropId}`,
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.data || response.data.length === 0) {
        setSchedule([]);
        toast.warn("No schedule returned.");
      } else {
        setSchedule(response.data);
        toast.success(regenerate ? "Schedule regenerated!" : "Schedule generated!");
      }
    } catch (err) {
      console.error("❌ Error generating schedule:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to generate schedule. Please check the inputs.";
      toast.error(message);

      if ([401, 403].includes(err.response?.status)) {
        navigate("/login");
      }

      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  // Save schedule
  const saveSchedule = async () => {
    if (!schedule.length) {
      toast.error("No schedule to save!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to continue.");
      navigate("/login");
      return;
    }

    const requestData = {
      farmerId: parseInt(farmerId),
      cropId: parseInt(cropId),
      startDate: plantingDate,
      stages: schedule.map((item) => ({
        stage: item.stage || "N/A",
        startDate: item.startDate || "N/A",
        endDate: item.endDate || "N/A",
        activities: item.activities || "N/A",
        pesticides: item.pesticides || null
      }))
    };

    try {
      await axios.post("http://localhost:8082/api/schedules/save", requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Schedule saved successfully!");
      navigate("/saved-schedules");
    } catch (err) {
      console.error("❌ Error saving schedule:", err);
      const message = err.response?.data?.message || err.response?.data || "Failed to save schedule.";
      toast.error(message);
    }
  };

  // Download PDF
  const downloadPDF = () => {
    if (!schedule.length) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Crop Growth Schedule - ${cropName}`, 14, 20);

    autoTable(doc, {
      head: [["Stage", "Start Date", "End Date", "Activities", "Pesticides / Herbicides"]],
      body: schedule.map((item) => [
        item.stage || "N/A",
        item.startDate || "N/A",
        item.endDate || "N/A",
        item.activities || "N/A",
        item.pesticides || "N/A"
      ]),
      startY: 30,
      theme: "striped"
    });

    doc.save(`${cropName.toLowerCase().replace(/\s+/g, "_")}_schedule_${dayjs(plantingDate).format("YYYYMMDD")}.pdf`);
  };

  return (
    <div className="w-full px-4 py-10">
      <h2 className="text-2xl font-bold text-emerald-700 text-center mb-6">
        📅 Crop Growth Schedule for <span className="text-gray-800">{cropName}</span>
      </h2>

      {/* Crop details */}
      <div className="flex justify-center gap-4 mb-4 flex-wrap">
        <span className="bg-emerald-100 px-4 py-2 rounded text-sm text-gray-700">
          🌱 Seed Type: <strong>{seedType}</strong>
        </span>
        <span className="bg-yellow-100 px-4 py-2 rounded text-sm text-gray-700">
          📦 Quantity: <strong>{quantity}</strong>
        </span>
      </div>

      {/* Controls */}
      <div className="mb-4 flex justify-center items-center gap-4 flex-wrap">
        <label htmlFor="plantingDate" className="font-semibold">Select Planting Date:</label>
        <input
          id="plantingDate"
          type="date"
          value={plantingDate}
          onChange={(e) => setPlantingDate(e.target.value)}
          className="border px-4 py-2 rounded-md"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="regenerate"
            checked={regenerate}
            onChange={() => setRegenerate(!regenerate)}
          />
          <label htmlFor="regenerate">Regenerate Schedule</label>
        </div>
        <button
          onClick={generateSchedule}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"}`}
        >
          {loading ? "Loading..." : regenerate ? "Regenerate Schedule" : "Generate Schedule"}
        </button>
      </div>

      {/* Professional note with icon */}
      <div className="flex items-center justify-center bg-emerald-50 border-l-4 border-emerald-400 text-gray-700 px-4 py-3 mb-6 rounded-md">
        <FaInfoCircle className="mr-2 text-emerald-600" />
        <span>
          After generating a schedule, you can view all saved crop schedules by clicking <strong>View Saved Schedules</strong> below.
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center">Loading schedule...</p>
      ) : schedule.length ? (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm rounded-lg shadow-md">
            <thead className="bg-emerald-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Stage</th>
                <th className="px-4 py-2 border">Start Date</th>
                <th className="px-4 py-2 border">End Date</th>
                <th className="px-4 py-2 border">Activities</th>
                <th className="px-4 py-2 border">Pesticides / Herbicides</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, index) => (
                <tr key={index} className="border-t bg-white hover:bg-emerald-50">
                  <td className="px-4 py-2 border font-medium">{item.stage || "N/A"}</td>
                  <td className="px-4 py-2 border">{item.startDate || "N/A"}</td>
                  <td className="px-4 py-2 border">{item.endDate || "N/A"}</td>
                  <td className="px-4 py-2 border">{item.activities || "N/A"}</td>
                  <td className="px-4 py-2 border">{item.pesticides || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {schedule.length ? (
          <>
            <button onClick={downloadPDF} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Download Schedule as PDF
            </button>
            <button onClick={saveSchedule} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
              Save Schedule
            </button>
          </>
        ) : null}
        <button onClick={() => navigate("/saved-schedules")} className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-800">
          View Saved Schedules
        </button>
        <button onClick={() => navigate("/sell-markets")} className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-800">
          🏬 View Crop Selling Markets
        </button>
      </div>
    </div>
  );
};

export default Schedule;
