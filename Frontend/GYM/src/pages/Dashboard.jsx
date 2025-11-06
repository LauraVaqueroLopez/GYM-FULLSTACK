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
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido, {user?.nombre || "Usuario"} 👋
      </h1>
      <p>Rol: {user?.rol}</p>

      {/* Botón de seguimiento */}
      <div className="my-4">
        <Link to="/seguimiento" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Ir a Seguimiento
        </Link>
      </div>

      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Cerrar sesión
      </button>

      <hr className="my-6" />

      {user?.rol === "cliente" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Lista de Entrenadores</h2>
          {mensaje && <p className="mb-4 text-blue-700">{mensaje}</p>}

          {entrenadores.length > 0 ? (
            <ul className="space-y-4">
              {entrenadores.map((ent) => (
                <li key={ent.id_entrenador} className="border p-4 rounded-lg shadow">
                  <p><strong>{ent.Usuario?.nombre}</strong> - {ent.especialidad}</p>
                  <p>Experiencia: {ent.experiencia} años</p>
                  <button
                    onClick={() => handleContratar(ent.id_entrenador)}
                    className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
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
