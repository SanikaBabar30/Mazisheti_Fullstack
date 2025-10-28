import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import {
  faUser,
  faPhone,
  faEnvelope,
  faLock,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "react-toastify/dist/ReactToastify.css";

function BuyerRegister() {
  const [form, setForm] = useState({
    buyerName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:8082/api/buyers/register", {
        buyerName: form.buyerName,
        mobileNumber: form.mobileNumber,
        email: form.email,
        password: form.password,
      });

      toast.success("Buyer registered successfully!");
      setForm({
        buyerName: "",
        mobileNumber: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Registration failed!";
      console.error("Registration error:", errorMessage);
      toast.error("Registration failed: " + errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-green-50 px-4 py-8">
      <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow-lg">
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-700 mb-6 text-center">
          Buyer Registration
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            {
              icon: faUser,
              label: "Buyer Name",
              name: "buyerName",
              type: "text",
              placeholder: "Enter your name",
            },
            {
              icon: faPhone,
              label: "Mobile Number",
              name: "mobileNumber",
              type: "tel",
              placeholder: "Enter mobile number",
            },
            {
              icon: faEnvelope,
              label: "Email",
              name: "email",
              type: "email",
              placeholder: "you@example.com",
            },
            {
              icon: faLock,
              label: "Password",
              name: "password",
              type: "password",
              placeholder: "Enter password",
            },
            {
              icon: faCheck,
              label: "Confirm Password",
              name: "confirmPassword",
              type: "password",
              placeholder: "Re-enter password",
            },
          ].map(({ icon, label, name, type, placeholder }) => (
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
                placeholder={placeholder}
                value={form[name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base"
              />
            </div>
          ))}

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
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default BuyerRegister;
