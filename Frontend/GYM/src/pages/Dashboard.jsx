import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getEntrenadores,
  contratarEntrenador,
  getMisContrataciones,
  cancelarContratacion,
} from "../api/entrenadoresApi";

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

        // Solo para clientes: cargar sus contrataciones
        if (user?.rol === "cliente") {
          try {
            const mis = await getMisContrataciones();
            setContrataciones(mis || []);
          } catch (innerErr) {
            console.warn("No hay contrataciones o no es cliente");
          }
        }
      } catch (err) {
        console.error("Error al cargar entrenadores:", err);
      }
    };

    fetchEntrenadores();
  }, [user]);

  const handleContratar = async (id_entrenador) => {
    try {
      const res = await contratarEntrenador(id_entrenador);
      setMensaje(res.message || "Entrenador contratado correctamente ✅");

      if (res.contratacion)
        setContrataciones((s) => [...s, res.contratacion]);
    } catch (err) {
      setMensaje(
        err.response?.data?.message || "Error al contratar entrenador ❌"
      );
    }
  };

  const handleCancelar = async (idContratacion) => {
    try {
      const res = await cancelarContratacion(idContratacion);
      setMensaje(res.message || "Contratación cancelada");

      setContrataciones((s) =>
        s.map((c) =>
          c.id_contratacion === idContratacion
            ? { ...c, estado: "cancelada" }
            : c
        )
      );
    } catch (err) {
      setMensaje(
        err.response?.data?.message || "Error al cancelar contratación"
      );
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Bienvenido, {user?.nombre || "Usuario"} 👋
      </h1>
      <p className="dashboard-role">Rol: {user?.rol}</p>

      {/* Botones superiores */}
      <div className="dashboard-buttons">
        {user?.rol === "cliente" && (
          <>
            <Link to="/seguimiento" className="btn-seguimiento">
              Ir a Seguimiento
            </Link>
            <Link to="/tienda" className="btn-tienda">
              Ir a Tienda
            </Link>
          </>
        )}

        <button onClick={logout} className="btn-logout">
          <span className="btn-logout-text">Salir</span>
        </button>
      </div>

      <hr className="my-6" />

      {/* Cliente: lista de entrenadores y contrataciones */}
      {user?.rol === "cliente" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Lista de Entrenadores</h2>
          {mensaje && <p className="mb-4 text-blue-700">{mensaje}</p>}

          {entrenadores.length > 0 ? (
            <ul className="space-y-4">
              {entrenadores.map((ent) => {
<<<<<<< HEAD
                const contratacionActiva = contrataciones.find(
                  (c) =>
                    c.id_entrenador === ent.id_entrenador &&
                    c.estado === "activa"
                );

                const tieneAlgunaActiva = contrataciones.some(
                  (c) => c.estado === "activa"
                );

=======
                const contratacionActiva = contrataciones.find((c) => c.id_entrenador === ent.id_entrenador && c.estado === "activa");
>>>>>>> a4bacefca9076acbf8421b2ee457161e71375c73
                return (
                  <li key={ent.id_entrenador}>
                    <p>
                      <strong>{ent.Usuario?.nombre}</strong> - {ent.especialidad}
                    </p>
                    <p>Experiencia: {ent.experiencia} años</p>

                    {!contratacionActiva ? (
<<<<<<< HEAD
                      tieneAlgunaActiva ? (
                        <button disabled title="Tienes una contratación activa">
                          Ya tienes entrenador
                        </button>
                      ) : (
                        <button
                          onClick={() => handleContratar(ent.id_entrenador)}
                        >
                          Contratar
                        </button>
                      )
=======
                      <button onClick={() => handleContratar(ent.id_entrenador)}>Contratar</button>
>>>>>>> a4bacefca9076acbf8421b2ee457161e71375c73
                    ) : (
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className="small">Contratado</span>
                        <button
                          onClick={() =>
                            handleCancelar(contratacionActiva.id_contratacion)
                          }
                        >
                          Dar de baja
                        </button>
                        <Link
                          to={`/reserva/${ent.id_entrenador}`}
                          className="btn-primary btn-small"
                        >
                          Reservar Clase
                        </Link>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No hay entrenadores disponibles.</p>
          )}
        </div>
      )}

      {/* Entrenador: botón para crear clase */}
      {user?.rol === "entrenador" && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Panel de Entrenador</h2>
          {mensaje && <p className="mb-4 text-blue-700">{mensaje}</p>}
          <Link to="/crear-clase" className="btn-primary">
            Crear Clase
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
