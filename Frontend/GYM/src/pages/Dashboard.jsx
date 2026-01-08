import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getEntrenadores,
  contratarEntrenador,
  getMisContrataciones,
  cancelarContratacion,
} from "../api/entrenadoresApi";
import { getCodigoPersonal } from "../api/authApi";


const Dashboard = () => {
  const { user, logout, token } = useContext(AuthContext);
  const [entrenadores, setEntrenadores] = useState([]);
  const [contrataciones, setContrataciones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [codigo, setCodigo] = useState(null);
  const [codigoBuscar, setCodigoBuscar] = useState("");
  const navigate = useNavigate();

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
    // Cargar codigo_personal si es cliente
    const fetchCodigo = async () => {
      try {
        if (user?.rol === "cliente") {
          const effectiveToken = token || localStorage.getItem("token");
          if (!effectiveToken) return;
          const res = await getCodigoPersonal(effectiveToken);
          setCodigo(res.data?.codigo_personal || null);
        }
      } catch (err) {
        console.error("Error al obtener codigo_personal:", err);
      }
    };

    fetchCodigo();
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
      {user?.rol === "cliente" && codigo && (
        <p className="dashboard-code">Tu código personal: <strong>{codigo}</strong></p>
      )}

      <div className="dashboard-buttons">
        {user?.rol === "cliente" && (
          <>
            <Link to="/seguimiento" className="btn-seguimiento">
              Ir a Seguimiento
            </Link>
            <Link to="/reserva-clase" className="btn-reservar">
              Reservar Clase
            </Link>
            <Link to="/resenas" className="btn-reseñas">
              Poner Reseñas
            </Link>
          </>
        )}

        <Link to="/tienda" className="btn-tienda">
          Ir a Tienda
        </Link>
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
                // Permitimos contratar múltiples entrenadores simultáneamente.

                return (
                  <li key={ent.id_entrenador}>
                    <p>
                      <strong>{ent.Usuario?.nombre}</strong> - {ent.especialidad}
                    </p>
                    <p>Experiencia: {ent.experiencia} años</p>

                    {!contratacionActiva ? (
                      /* Si NO está contratado actualmente: mostrar botón contratar (permitir múltiples) */
                      <button
                        onClick={() => handleContratar(ent.id_entrenador)}
                        className="btn-primary"
                      >
                        Contratar
                      </button>
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

          <div style={{ marginTop: 16 }}>
            <h3>Acceder al seguimiento de un cliente</h3>
            <p className="small">Introduce el código del cliente y pulsa Buscar.</p>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <input
                placeholder="Código cliente"
                value={codigoBuscar}
                onChange={(e) => setCodigoBuscar(e.target.value)}
              />
              <button
                className="btn-seguimiento"
                onClick={() => {
                  const codigoTrim = (codigoBuscar || "").trim();
                  if (!codigoTrim) return alert("Introduce un código válido");
                  navigate(`/seguimiento?codigo=${encodeURIComponent(codigoTrim)}`);
                }}
              >
                Buscar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;