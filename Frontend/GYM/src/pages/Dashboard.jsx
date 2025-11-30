import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getEntrenadores, contratarEntrenador, getMisContrataciones, cancelarContratacion } from "../api/entrenadoresApi";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [entrenadores, setEntrenadores] = useState([]);
  const [contrataciones, setContrataciones] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchEntrenadores = async () => {
      try {
        const data = await getEntrenadores();
        setEntrenadores(data);
        // si el usuario es cliente, obtener sus contrataciones para marcar entrenadores contratados
        try {
          const mis = await getMisContrataciones();
          setContrataciones(mis || []);
        } catch (innerErr) {
          // ignorar si el usuario no está autenticado o no es cliente
            // console.warn('No pude cargar contrataciones:', innerErr);
        }
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
      // añadir la nueva contratación al estado si viene en la respuesta
      if (res.contratacion) setContrataciones((s) => [...s, res.contratacion]);
    } catch (err) {
      setMensaje(err.response?.data?.message || "Error al contratar entrenador ❌");
    }
  };

  const handleCancelar = async (idContratacion) => {
    try {
      const res = await cancelarContratacion(idContratacion);
      setMensaje(res.message || "Contratación cancelada");
      // actualizar el estado local: usar id_contratacion (clave primaria en el backend)
      setContrataciones((s) => s.map((c) => (c.id_contratacion === idContratacion ? { ...c, estado: "cancelada" } : c)));
    } catch (err) {
      setMensaje(err.response?.data?.message || "Error al cancelar contratación");
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
          <span className="btn-logout-text">Salir</span>
        </button>
      </div>

      <hr className="my-6" />

      {user?.rol === "cliente" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Lista de Entrenadores</h2>
          {mensaje && <p className="mb-4 text-blue-700">{mensaje}</p>}

              {entrenadores.length > 0 ? (
            <>
            <ul className="space-y-4">
              {entrenadores.map((ent) => {
                const contratacionActiva = contrataciones.find((c) => c.id_entrenador === ent.id_entrenador && c.estado === "activa");
                return (
                  <li key={ent.id_entrenador}>
                    <p><strong>{ent.Usuario?.nombre}</strong> - {ent.especialidad}</p>
                    <p>Experiencia: {ent.experiencia} años</p>
                    {!contratacionActiva ? (
                      <button onClick={() => handleContratar(ent.id_entrenador)}>Contratar</button>
                    ) : (
                      <div style={{display:'flex',gap:8,alignItems:'center'}}>
                        <span className="small">Contratado</span>
                        <button onClick={() => handleCancelar(contratacionActiva.id_contratacion)} >Dar de baja</button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <div style={{marginTop:12}}>
              <Link to="/resenas" className="btn-secondary btn-small">Ver más</Link>
            </div>
            </>
          ) : (
            <p>No hay entrenadores disponibles.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
