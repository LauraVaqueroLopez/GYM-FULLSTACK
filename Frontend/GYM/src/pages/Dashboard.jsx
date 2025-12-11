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
            {/* 📌 Añadimos el botón de reservar clase aquí para fácil acceso */}
            {contrataciones.some((c) => c.estado === "activa") && (
              <Link to="/reserva-clase" className="btn-reserva">
                Reservar Clase
              </Link>
            )}
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
                // 1. Encontrar si el entrenador actual tiene una contratación activa con el cliente
                const contratacionActiva = contrataciones.find(
                  (c) =>
                    c.id_entrenador === ent.id_entrenador &&
                    c.estado === "activa"
                );

                // 2. Comprobar si el cliente tiene CUALQUIER otra contratación activa
                const tieneAlgunaActiva = contrataciones.some(
                  (c) => c.estado === "activa"
                );
                
                // NOTA: La lógica de tu rama (HEAD) era más completa que la de tu compañero, 
                // ya que comprueba si ya tiene *alguna* contratación activa para limitar a 1 entrenador.
                // Hemos fusionado y limpiado este bloque.

                return (
                  <li key={ent.id_entrenador}>
                    <p>
                      <strong>{ent.Usuario?.nombre}</strong> - {ent.especialidad}
                    </p>
                    <p>Experiencia: {ent.experiencia} años</p>

                    {!contratacionActiva ? (
                      /* Si NO está contratado actualmente: */
                      tieneAlgunaActiva ? (
                        /* Ya tiene otro entrenador contratado */
                        <button disabled title="Tienes una contratación activa" className="btn-disabled">
                          Ya tienes entrenador
                        </button>
                      ) : (
                        /* Puede contratar a este entrenador */
                        <button
                          onClick={() => handleContratar(ent.id_entrenador)}
                          className="btn-primary"
                        >
                          Contratar
                        </button>
                      )
                    ) : (
                      /* Si SÍ está contratado actualmente: */
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className="small text-green-600 font-bold">Contratado ✅</span>
                        <button
                          onClick={() =>
                            handleCancelar(contratacionActiva.id_contratacion)
                          }
                          className="btn-secondary"
                        >
                          Dar de baja
                        </button>
                        {/* ⚠️ Nota: Esta ruta de reserva individual ya no es necesaria 
                             si usas el botón global de arriba, pero la mantenemos por consistencia. */}
                        <Link
                          to={`/reserva-clase`} 
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