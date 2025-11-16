import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getEntrenadores } from "../api/entrenadoresApi";
import resenasApi from "../api/resenasApi";
import { getMisContrataciones } from "../api/entrenadoresApi";

const Resenas = () => {
  const { user } = useContext(AuthContext);
  const [entrenadores, setEntrenadores] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedTrainerName, setSelectedTrainerName] = useState("");
  const [selectedTrainerUserId, setSelectedTrainerUserId] = useState(null);
  const [selectedTrainerEntrenadorId, setSelectedTrainerEntrenadorId] = useState(null);
  const [resenas, setResenas] = useState([]);
  const [resenasLoading, setResenasLoading] = useState(false);
  const [reseniaexiste, setreseniaexiste] = useState(false);
  const [misContrataciones, setMisContrataciones] = useState([]);
  const [comentario, setComentario] = useState("");
  const [puntuacion, setPuntuacion] = useState(5);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const load = async () => {
      const t = await getEntrenadores();
      setEntrenadores(t);
      if (user && user.rol === "cliente") {
          try {
            const mis = await getMisContrataciones();
            setMisContrataciones(mis || []);
          } catch (err) {
            // ignorar errores
          }
        }
    };
    load();
  }, [user]);

  const verResenas = async (ent, displayName) => {
    // determinar el id de usuario del entrenador de forma robusta
    const trainerUserId = ent?.Usuario?.id_usuario || ent?.id_usuario || ent?.id_entrenador;
    // resolver el nombre para mostrar: usar displayName si se pasó, luego Usuario.nombre, else buscar en la lista de entrenadores
    const resolvedName = displayName || ent?.Usuario?.nombre || ent?.nombre || (entrenadores.find((e) => e.id_entrenador === ent.id_entrenador || e.Usuario?.id_usuario === trainerUserId)?.Usuario?.nombre) || "Entrenador";
    // limpiar datos previos para evitar mezclar información
    setSelectedTrainer(ent);
    setSelectedTrainerName(resolvedName);
    setSelectedTrainerUserId(trainerUserId || null);
    // intentar resolver id_entrenador (pk en la tabla entrenadores) para comprobaciones de permisos
    const resolvedEntrenadorId = (entrenadores.find((e) => e.Usuario?.id_usuario === trainerUserId || e.id_entrenador === ent.id_entrenador) || {}).id_entrenador || null;
    setSelectedTrainerEntrenadorId(resolvedEntrenadorId);
    // limpiar reseñas actuales e inputs inmediatamente para que la UI se reinicie mientras carga
    setMensaje("");
    setResenas([]);
    setComentario("");
    setPuntuacion(5);
    setResenasLoading(true);
    if (!trainerUserId) {
      setMensaje("No se pudo determinar el identificador del entrenador.");
      setResenasLoading(false);
      return;
    }
    try {
      const data = await resenasApi.getResenasPorEntrenador(trainerUserId);
      setResenas(data || []);
      // comprobar si el usuario actual ya escribió una reseña
      if (user && user.id_usuario) {
        const has = (data || []).some((r) => r.id_usuario === user.id_usuario);
        setreseniaexiste(Boolean(has));
      } else {
        setreseniaexiste(false);
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error cargando reseñas");
      setreseniaexiste(false);
    }
    setResenasLoading(false);
  };

  const puedeResenar = () => {
    if (!user || user.rol !== "cliente") return false;
    if (!selectedTrainerEntrenadorId) return false;
    // verificar si alguna contratacion coincide con este entrenador (por id_entrenador)
    const tieneContratacion = misContrataciones.some((c) => c.id_entrenador === selectedTrainerEntrenadorId && c.estado !== "cancelada");
    // además, el cliente no debe haber reseñado ya
    return tieneContratacion && !reseniaexiste;
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!selectedTrainer) return;
    setMensaje("");
    try {
      const payload = { id_entrenador: selectedTrainerUserId, puntuacion, comentario };
      const res = await resenasApi.crearResenia(payload);
      setMensaje(res.message || "Reseña añadida");
      // recargar reseñas
      const data = await resenasApi.getResenasPorEntrenador(selectedTrainerUserId);
      setResenas(data || []);
      setComentario("");
      setPuntuacion(5);
    } catch (err) {
      console.error(err);
      setMensaje(err.response?.data?.message || "Error al crear reseña");
    }
  };

  return (
    <div className="page-container resenas-page">
      <div className="resenas-header" style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px'}}>
        <Link to="/dashboard" className="btn-secondary btn-small">Volver</Link>
        <h2 style={{margin:0}}>Reseñas de Entrenadores</h2>
      </div>
      <div className="trainers-list">
        <h3>Entrenadores</h3>
        {entrenadores.length ? (
          <ul>
            {entrenadores.map((ent) => (
              <li key={ent.id_entrenador}>
                <div className="trainer-row">
                  <div className="trainer-info">
                    <strong>{ent.Usuario?.nombre}</strong> — {ent.especialidad}
                  </div>
                  <div className="trainer-resenias">
                    <button className="btn-secondary btn-small" onClick={() => verResenas(ent)}>Ver reseñas</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay entrenadores.</p>
        )}
      </div>

      {selectedTrainer && (
        <div className="card">
          {(() => {
            const nombre = selectedTrainer?.Usuario?.nombre || selectedTrainerName || "Entrenador";
            const apellidos = selectedTrainer?.Usuario?.apellidos || "";
            const especialidad = selectedTrainer?.especialidad || "";
            const fullname = apellidos ? `${nombre} ${apellidos}` : nombre;
            return (
              <h3>Reseñas del entrenador {fullname}{especialidad ? `, especialista en ${especialidad}` : ""}</h3>
            );
          })()}
          {mensaje && <p className="success">{mensaje}</p>}
          {resenas.length ? (
            <ul>
              {resenas.map((r) => (
                <li key={r.id_resenia} className="border p-2 mb-2">
                  <div><strong>{r.autor?.nombre}</strong> — {r.fecha}</div>
                  <div>Valoración: {r.puntuacion ?? "-"} / 5</div>
                  {r.comentario && <div>{r.comentario}</div>}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay reseñas aún.</p>
          )}

          {puedeResenar() ? (
            <form onSubmit={handleCrear} className="mt-4">
              <div className="field">
                <label>Puntuación</label>
                <select value={puntuacion} onChange={(e) => setPuntuacion(Number(e.target.value))}>
                  <option value={5}>5</option>
                  <option value={4}>4</option>
                  <option value={3}>3</option>
                  <option value={2}>2</option>
                  <option value={1}>1</option>
                </select>
              </div>
              <div className="field">
                <label>Comentario</label>
                <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} />
              </div>
              <div className="field">
                <button className="btn-primary">Enviar reseña</button>
              </div>
            </form>
          ) : (
            user?.rol === "cliente" ? (
              reseniaexiste ? (
                <div className="small">Ya has evaluado a este entrenador.</div>
              ) : (
                <div className="small">Solo puedes evaluar al entrenador que has contratado.</div>
              )
            ) : null
          )}
        </div>
      )}
    </div>
  );
};

export default Resenas;
