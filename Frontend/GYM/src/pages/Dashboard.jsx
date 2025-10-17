import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Bienvenido, {user?.nombre || "Usuario"} 👋</h1>
      <p className="dashboard-role">Rol: {user?.rol}</p>

      <div className="dashboard-actions">
        <Link to="/seguimiento" className="btn-primary">Ir a Seguimiento</Link>
      </div>

      <button onClick={logout} className="btn-logout">Cerrar sesión</button>
    </div>
  );
};

export default Dashboard;
