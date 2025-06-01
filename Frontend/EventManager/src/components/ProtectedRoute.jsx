// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ email, children }) => {
  if (!email) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
