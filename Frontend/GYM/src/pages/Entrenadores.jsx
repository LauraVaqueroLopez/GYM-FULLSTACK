import { useEffect, useState } from "react";
import { getEntrenadores, contratarEntrenador } from "../api/entrenadoresApi.js";
import { useAuth } from "../context/AuthContext.jsx";

function Entrenadores() {
  const [entrenadores, setEntrenadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const cargarEntrenadores = async () => {
      try {
        const data = await getEntrenadores();
        setEntrenadores(data);
      } catch (error) {
        console.error("Error cargando entrenadores:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarEntrenadores();
  }, []);

  const handleContratar = async (id_entrenador) => {
    if (!user || !user.id_cliente) {
      alert("Solo los clientes pueden contratar entrenadores");
      return;
    }

    try {
      await contratarEntrenador(user.id_cliente, id_entrenador);
      alert("Entrenador contratado con éxito 💪");
    } catch (error) {
      console.error("Error al contratar:", error);
      alert("Error al contratar entrenador");
    }
  };

  if (loading) return <p>Cargando entrenadores...</p>;

  return (
    <div className="entrenadores-page">
      <h2>Entrenadores Disponibles</h2>
      <ul>
        {entrenadores.map((ent) => (
          <li key={ent.id_entrenador}>
            <h3>
              {ent.Usuario?.nombre} {ent.Usuario?.apellidos}
            </h3>
            <p><strong>Especialidad:</strong> {ent.especialidad}</p>
            <p><strong>Experiencia:</strong> {ent.experiencia} años</p>
            <button onClick={() => handleContratar(ent.id_entrenador)}>
              Contratar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Entrenadores;
