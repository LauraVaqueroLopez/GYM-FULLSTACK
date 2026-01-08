import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { user, initializing } = useContext(AuthContext);
  if (initializing) return <div style={{ padding: 24 }}>Cargando sesión...</div>;
  if (!user) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
