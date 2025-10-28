import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserShield } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const res = await axios.post("http://localhost:8082/auth/login/admin", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "ADMIN");

      setSuccess(true);
      setTimeout(() => {
        navigate("/admin-dashboard");
      }, 1500);
    } catch (err) {
      setError("❌ Invalid admin credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-50 px-4 sm:px-6">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-sm sm:max-w-md animate-fade-in">
        <div className="flex justify-center text-emerald-700 text-5xl mb-4 sm:mb-6">
          <FontAwesomeIcon icon={faUserShield} />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-center text-emerald-700 mb-4">
          Admin Login
        </h2>

        {error && (
          <p className="text-red-600 text-center mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-center mb-4 text-sm font-medium">
            ✅ Welcome Admin! Login Successful.
          </p>
        )}

        <form onSubmit={handleAdminLogin}>
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
          Not an admin?{" "}
          <a
            href="/login"
            className="text-emerald-700 font-semibold hover:text-emerald-800"
          >
            Go to User Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
