import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

import {
  faUser,
  faStore,
  faPhone,
  faMapMarkedAlt,
  faBoxOpen,
  faIdCard,
  faEnvelope,
  faLock,
  faCheck,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const VendorRegister = () => {
  const [formData, setFormData] = useState({
    ownerName: "",
    shopName: "",
    mobileNumber: "",
    shopAddress: "",
    productType: "",
    licenseNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
  const mobileRegex = /^[1-9][0-9]{9}$/;

  const getPasswordStrength = (password) => {
    if (!password) return "";
    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);

    const strengthScore = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

    if (length >= 8 && strengthScore === 4) return "Strong";
    if (length >= 6 && strengthScore >= 2) return "Moderate";
    return "Weak";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    setErrors((prev) => ({
      ...prev,
      profileImage: "",
    }));
  };

  const validateFields = () => {
    const newErrors = {};

    const requiredFields = [
      "ownerName",
      "shopName",
      "mobileNumber",
      "shopAddress",
      "productType",
      "licenseNumber",
      "email",
      "password",
      "confirmPassword",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || formData[field].trim() === "") {
        newErrors[field] = "This field is required.";
      }
    });

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (formData.mobileNumber && !mobileRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits, not starting with 0.";
    }

    if (formData.password && !strongPasswordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8+ chars, with uppercase, lowercase, number, and special char.";
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!profileImage) {
      newErrors.profileImage = "Profile image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    const vendorBlob = new Blob([JSON.stringify({ ...formData })], {
      type: "application/json",
    });

    const data = new FormData();
    data.append("vendor", vendorBlob);
    data.append("profileImage", profileImage);

    try {
      await axios.post("http://localhost:8082/api/vendors/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Vendor registered successfully!");

      setFormData({
        ownerName: "",
        shopName: "",
        mobileNumber: "",
        shopAddress: "",
        productType: "",
        licenseNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setProfileImage(null);
      setImagePreview(null);
      setErrors({});
      setPasswordStrength("");
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed.";
      toast.error(msg);
    }
  };

  const fields = [
    { icon: faUser, label: "Owner Name", name: "ownerName", type: "text" },
    { icon: faStore, label: "Shop Name", name: "shopName", type: "text" },
    { icon: faPhone, label: "Mobile Number", name: "mobileNumber", type: "text" },
    { icon: faMapMarkedAlt, label: "Shop Address", name: "shopAddress", type: "text" },
    { icon: faBoxOpen, label: "Product Type", name: "productType", type: "text" },
    { icon: faIdCard, label: "License Number", name: "licenseNumber", type: "text" },
    { icon: faEnvelope, label: "Email", name: "email", type: "email" },
    { icon: faLock, label: "Password", name: "password", type: "password" },
    { icon: faCheck, label: "Confirm Password", name: "confirmPassword", type: "password" },
  ];

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-700 mb-6 text-center">
          Vendor Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ icon, label, name, type }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="flex items-center text-sm font-medium text-emerald-700 mb-1"
              >
                <FontAwesomeIcon icon={icon} className="mr-2 text-emerald-500" />
                {label}
              </label>
              <input
                id={name}
                name={name}
                type={type}
                placeholder={label}
                value={formData[name]}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border ${
                  errors[name] ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base`}
              />
              {name === "password" && formData.password && (
                <p
                  className={`text-xs mt-1 ${
                    passwordStrength === "Strong"
                      ? "text-green-600"
                      : passwordStrength === "Moderate"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  Password Strength: {passwordStrength}
                </p>
              )}
              {errors[name] && (
                <p className="text-red-600 text-xs mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          {/* Profile Image */}
          <div>
            <label className="flex items-center text-sm font-medium text-emerald-700 mb-1">
              <FontAwesomeIcon icon={faImage} className="mr-2 text-emerald-500" />
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className={`w-full border p-2 rounded ${
                errors.profileImage ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.profileImage && (
              <p className="text-red-600 text-xs mt-1">{errors.profileImage}</p>
            )}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded-full mx-auto"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-800 transition duration-300"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-emerald-700 font-semibold hover:text-emerald-800"
          >
            Login
          </a>
        </p>
      </motion.div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default VendorRegister;
