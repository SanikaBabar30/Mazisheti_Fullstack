import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ fixed import

const ProtectedRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  let decoded;
  try {
    decoded = jwtDecode(token);
  } catch (err) {
    console.error("Invalid token", err);
    return <Navigate to="/login" />;
  }

  const userRole = decoded.role;

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
