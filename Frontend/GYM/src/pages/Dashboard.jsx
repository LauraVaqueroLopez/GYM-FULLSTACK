import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getEntrenadores, contratarEntrenador } from "../api/entrenadoresApi";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [entrenadores, setEntrenadores] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchEntrenadores = async () => {
      try {
        const data = await getEntrenadores();
        setEntrenadores(data);
      } catch (err) {
        console.error("Error al cargar entrenadores:", err);
      }
    };
    fetchEntrenadores();
  }, []);

  const handleContratar = async (id_entrenador) => {
    try {
      const res = await contratarEntrenador(id_entrenador);
      setMensaje(res.message || "Entrenador contratado correctamente ✅");
    } catch (err) {
      setMensaje(err.response?.data?.message || "Error al contratar entrenador ❌");
    }
  };

  return (

    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Bienvenido, {user?.nombre || "Usuario"} 👋
      </h1>
      <p className="dashboard-role">Rol: {user?.rol}</p>
      {/* Botón de seguimiento */}
      <div className="dashboard-buttons">

          <Link to="/seguimiento" className="btn-seguimiento">
            Ir a Seguimiento
          </Link>

        <button
          onClick={logout}
          className="btn-logout"
        >
          <span className="btn-logout-text">Cerrar sesión</span>
        </button>
      </div>

      <hr className="my-6" />

      {user?.rol === "cliente" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Lista de Entrenadores</h2>
          {mensaje && <p className="mb-4 text-blue-700">{mensaje}</p>}

          {entrenadores.length > 0 ? (
            <ul>
              {entrenadores.map((ent) => (
                <li key={ent.id_entrenador}>
                  <p><strong>{ent.Usuario?.nombre}</strong> - {ent.especialidad}</p>
                  <p>Experiencia: {ent.experiencia} años</p>
                  <button
                    onClick={() => handleContratar(ent.id_entrenador)}
                
                  >
                    Contratar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay entrenadores disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
