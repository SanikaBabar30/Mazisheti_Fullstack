import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Single login endpoint for Farmer, Vendor, Buyer
      const response = await axios.post("http://localhost:8082/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const userData = response.data;

        // ✅ Save all required data
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("email", userData.email);
        localStorage.setItem("role", userData.role.toUpperCase()); // ✅ Save role
        if (userData.token) {
          localStorage.setItem("token", userData.token); // ✅ Save JWT token
        }

        // Handle roles and redirect
        switch (userData.role.toUpperCase()) {
          case "ADMIN":
            alert("Admin Login Successful!");
            navigate("/admin-dashboard");
            break;
          case "FARMER":
            if (userData.farmerId) localStorage.setItem("farmerId", userData.farmerId);
            alert("Farmer Login Successful!");
            navigate("/crop/complete-profile");
            break;
          case "VENDOR":
  if (userData.vendorId) localStorage.setItem("vendorId", userData.vendorId);
  alert("Vendor Login Successful!");
  navigate("/vendor-dashboard", { state: { vendorId: userData.vendorId } });
  break;

          case "BUYER":
            if (userData.buyerId) localStorage.setItem("buyerId", userData.buyerId);
            alert("Buyer Login Successful!");
            navigate("/buyer-dashboard");
            break;
          default:
            setError("Unauthorized role. Access denied.");
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.error || "Invalid email or password.";
      setError(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-50 px-4 sm:px-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-sm sm:max-w-md animate-fade-in">
        <div className="flex justify-center text-emerald-700 text-5xl mb-4 sm:mb-6">
          <FontAwesomeIcon icon={faUserCircle} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-emerald-700 mb-4">
          Login
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-emerald-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-emerald-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm sm:text-base"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm sm:text-base"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/buyer-register"
            className="text-emerald-700 font-semibold hover:text-emerald-800"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
