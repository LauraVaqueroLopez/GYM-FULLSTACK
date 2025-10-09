import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido, {user?.nombre || "Usuario"} 👋
      </h1>
      <p>Rol: {user?.rol}</p>
      <button
        onClick={logout}
        className="mt-6 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
