import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const fields = [
  { label: "Aadhaar Number", name: "aadhaar", type: "text" },
  { label: "Current Address", name: "currentAddress", type: "text" },
  { label: "Farm Address", name: "farmAddress", type: "text" },
  { label: "District", name: "district", type: "text" },
  { label: "Land Size (in acres)", name: "landSize", type: "number" },
];

const CompleteProfile = () => {
  const [formData, setFormData] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const filled = Object.values(formData).filter(Boolean).length;
    setProgress(Math.round((filled / fields.length) * 100));
  }, [formData]);

  useEffect(() => {
    document.body.style.overflow = showTermsModal ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [showTermsModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step < fields.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("Email not found. Please login again.");
      return;
    }

    try {
      await axios.post("http://localhost:8082/auth/complete-profile", {
        email,
        aadhaar: formData.aadhaar,
        currentAddress: formData.currentAddress,
        farmAddress: formData.farmAddress,
        district: formData.district,
        landSize: parseFloat(formData.landSize),
      });

      toast.success("Profile completed successfully!");
      navigate("/crop/selection");
    } catch (err) {
      const msg = err.response?.data?.message || "Profile submission failed!";
      toast.error(msg);
      console.error("Error submitting profile:", msg);
    }
  };

  const currentField = fields[step];

  // ✅ Validation for each step
  const isAadhaarStep = step === 0;
  const isAddressStep = ["currentAddress", "farmAddress", "district"].includes(
    currentField.name
  );

  const isAadhaarValid =
    formData.aadhaar.trim().length === 12 && /^\d{12}$/.test(formData.aadhaar); // 12 digits only
  const isTextValid =
    isAddressStep && formData[currentField.name].trim().length > 0;

  const disableNext =
    (isAadhaarStep && !isAadhaarValid) ||
    (isAddressStep && !isTextValid);

  return (
    <div className="max-w-xl mx-auto py-10 px-6 bg-gradient-to-r from-green-100 to-green-200 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-emerald-800 mb-6 text-center">
        👤 Complete Farmer Profile
      </h1>

      {/* ✅ Progress Circle */}
      <div className="flex justify-center mb-6">
        <div className="relative w-24 h-24">
          <svg
            className="absolute top-0 left-0 w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            {/* Background */}
            <path
              className="text-gray-300"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            {/* Progress */}
            <path
              className="text-emerald-600 transition-all duration-500 ease-out"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="100, 100"
              strokeDashoffset={100 - progress}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-gray-800">
            {progress}%
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentField.label}
            </label>
            {["currentAddress", "farmAddress"].includes(currentField.name) ? (
              <textarea
                name={currentField.name}
                value={formData[currentField.name]}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            ) : (
              <input
                type={currentField.type}
                name={currentField.name}
                value={formData[currentField.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            )}
          </div>

          {/* Terms Checkbox */}
          {step === fields.length - 1 && (
            <div className="mt-6 flex items-center">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                id="terms-checkbox"
                className="mr-2"
                required
              />
              <label htmlFor="terms-checkbox" className="text-sm text-gray-600">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-emerald-600 hover:underline font-medium"
                >
                  Terms and Conditions
                </button>
              </label>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:bg-gray-200"
          >
            Back
          </button>

          {step === fields.length - 1 ? (
            <button
              type="submit"
              disabled={!isChecked}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400"
            >
              Submit
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={disableNext}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-400"
            >
              Next
            </button>
          )}
        </div>
      </form>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-8 max-h-[80vh] overflow-y-auto shadow-xl">
            <h2 className="text-2xl font-bold text-emerald-700 mb-4">
              Terms and Conditions
            </h2>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
              <li>All the information provided is accurate and complete.</li>
              <li>Information may be shared with government authorities.</li>
              <li>Used for schemes and subsidy programs.</li>
              <li>Update your info if anything changes.</li>
              <li>False data may disqualify you from benefits.</li>
            </ul>
            <div className="mt-6 text-right">
              <button
                onClick={() => setShowTermsModal(false)}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CompleteProfile;