import { Navigate } from "react-router-dom";

export default function RoleGuard({ children, allowedRoles }) {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Optionally redirect to a Not Authorized page, or Dashboard
    return <Navigate to="/dashboard" />;
  }

  return children;
}
