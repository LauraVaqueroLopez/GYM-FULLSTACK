import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import seguimientoApi from "../api/seguimientoApi";
import { getClienteByCodigo } from "../api/authApi";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="card">
          <h3>Ha ocurrido un error</h3>
          <pre className="pre-wrap">{String(this.state.error)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const ChartWrapper = ({ data }) => {
  return <Line data={data} />;
};

const Seguimiento = () => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [entries, setEntries] = useState([]);
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [calorias, setCalorias] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10));
  const [observaciones, setObservaciones] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [clienteInfo, setClienteInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [showAllEntries, setShowAllEntries] = useState(false);
  const VISIBLE_ENTRIES = 2; // show 'Ver más' when there are more than 2 entries
  const [objetivoEditing, setObjetivoEditing] = useState(false);
  const [objetivoValue, setObjetivoValue] = useState("");

  const normalizeObjetivo = (raw) => {
    if (!raw && raw !== 0) return "";
    const s = String(raw).normalize('NFC').trim().toLowerCase();
    // map common variants to canonical values
    if (s.includes('perder')) return 'perder peso';
    if (s.includes('ganar') || s.includes('muscul')) return 'ganar músculo';
    if (s.includes('mejorar') || s.includes('resisten')) return 'mejorar resistencia';
    if (s.includes('otro')) return 'otro';
    // fallback: return trimmed raw
    return raw;
  };

  useEffect(() => {
    if (user && user.rol === "cliente") {
      fetchPorUsuario(user.id_usuario);
    }
  }, [user]);

  const location = useLocation();

  // Buscar cliente por codigo_personal (entrenador/admin) y cargar sus entradas
  const buscarPorCodigo = async (codigo) => {
    if (!codigo) return;
    setMensaje("");
    try {
      const tokenLocal = token || localStorage.getItem("token");
      const resCliente = await getClienteByCodigo(codigo, tokenLocal);
      const cliente = resCliente.data.cliente || null;
      const uInfo = resCliente.data.user || null;
      if (!uInfo) {
        setMensaje("Cliente no encontrado");
        return;
      }
      setClienteInfo(cliente);
      setObjetivoValue(cliente?.objetivo || "");
      setUserInfo(uInfo);

      const resEntries = await seguimientoApi.obtenerPorUsuario(uInfo.id_usuario, tokenLocal);
      const serverEntries = resEntries.data.entries || [];

      const entriesWithInit = (() => {
        if (!cliente || cliente.peso === null || cliente.peso === undefined) return serverEntries;
        const alreadyHas = serverEntries.some((e) => Number(e.peso) === Number(cliente.peso));
        if (alreadyHas) return serverEntries;
        const initEntry = {
          id_seguimiento: "init",
          id_usuario: cliente.id_usuario || null,
          fecha: uInfo?.fecha_registro || "Registro",
          peso: Number(cliente.peso),
          altura: cliente.altura || null,
          calorias_quemadas: null,
          observaciones: "Peso al registrarse",
        };
        return [initEntry, ...serverEntries];
      })();

      setEntries(entriesWithInit);
    } catch (err) {
      console.error("Error buscar por codigo:", err);
      setMensaje(err.response?.data?.message || "Error buscando cliente");
    }
  };

  // Si la ruta tiene ?codigo=..., realizar búsqueda automática al montar/cambiar la query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const codigoParam = params.get("codigo");
    if (codigoParam && (user?.rol === "entrenador" || user?.rol === "admin")) {
      buscarPorCodigo(codigoParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, user]);

  // sync objetivoValue when clienteInfo changes
  useEffect(() => {
    setObjetivoValue(normalizeObjetivo(clienteInfo?.objetivo));
  }, [clienteInfo]);

  const canEditObjetivo = () => {
    if (!user || !userInfo) return false;
    if (user.rol === "cliente") return user.id_usuario === userInfo.id_usuario;
    if (user.rol === "entrenador" || user.rol === "admin") return true;
    return false;
  };

  const handleSaveObjetivo = async () => {
    try {
      const tokenLocal = token || localStorage.getItem("token");
      // call API to update objetivo
      await seguimientoApi.actualizarObjetivo(userInfo.id_usuario, objetivoValue || "", tokenLocal);
      // refresh local clienteInfo
      setClienteInfo((c) => ({ ...(c || {}), objetivo: objetivoValue || null }));
      setMensaje("Objetivo actualizado");
      setObjetivoEditing(false);
    } catch (err) {
      console.error("Error actualizando objetivo:", err);
      setMensaje(err.response?.data?.message || "Error actualizando objetivo");
    }
  };

  const fetchPorUsuario = async (id) => {
    // clear previous messages when loading new data
    setMensaje("");
    try {
      const res = await seguimientoApi.obtenerPorUsuario(id, token);
      const serverEntries = res.data.entries || [];
  const cliente = res.data.cliente || null;
  const uInfo = res.data.user || null;
  setClienteInfo(cliente);
  setObjetivoValue(cliente?.objetivo || "");
  setUserInfo(uInfo);
      // if cliente has an initial peso from registration, prepend it as first data point
      const entriesWithInit = (() => {
        if (!cliente || cliente.peso === null || cliente.peso === undefined) return serverEntries;
        // avoid duplicate: if server already contains an entry with same peso and no fecha conflict, skip
        const alreadyHas = serverEntries.some((e) => Number(e.peso) === Number(cliente.peso));
        if (alreadyHas) return serverEntries;
        // create a synthetic initial entry; label fecha as 'Registro' so it's visible on chart
          const initEntry = {
          id_seguimiento: "init",
          id_usuario: id,
            fecha: uInfo?.fecha_registro || "Registro",
          peso: Number(cliente.peso),
          altura: cliente.altura || null,
          calorias_quemadas: null,
          observaciones: "Peso al registrarse",
        };
        return [initEntry, ...serverEntries];
      })();

      setEntries(entriesWithInit);
    } catch (err) {
      console.error("Error fetchPorUsuario:", err);
    }
  };

  // Validation helpers
  const isNumeric = (v) => !isNaN(v) && v !== null && v !== "";

  const validateCrear = () => {
    const errors = {};
    // peso required
    if (peso === "" || peso === null || peso === undefined) {
      errors.peso = "El peso es obligatorio.";
    } else if (!isNumeric(peso)) {
      errors.peso = "El peso debe ser un número válido (ej. 70.5).";
    } else if (Number(peso) <= 0) {
      errors.peso = "El peso debe ser mayor que 0.";
    }

    // fecha required
    if (!fecha) {
      errors.fecha = "La fecha es obligatoria.";
    } else if (isNaN(new Date(fecha).getTime())) {
      errors.fecha = "Fecha inválida.";
    }

    // altura optional but if provided must be numeric and reasonable
    if (altura !== "" && altura !== null && altura !== undefined) {
      if (!isNumeric(altura)) {
        errors.altura = "La altura debe ser un número válido (ej. 175.50).";
      } else if (Number(altura) <= 20 || Number(altura) > 300) {
        errors.altura = "La altura debe estar entre 20 y 300 cm.";
      }
    }

    // calorias optional -> numeric integer >=0
    if (calorias !== "" && calorias !== null && calorias !== undefined) {
      if (!isNumeric(calorias) || !Number.isFinite(Number(calorias))) {
        errors.calorias = "Las calorías deben ser un número entero (ej. 200).";
      } else if (Number(calorias) < 0) {
        errors.calorias = "Las calorías no pueden ser negativas.";
      }
    }

    // observaciones optional but limit length
    if (observaciones && observaciones.length > 1000) {
      errors.observaciones = "Observaciones demasiado largas (máx. 1000 caracteres).";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEdit = (values) => {
    const errors = {};
    if (values.peso !== undefined) {
      if (values.peso === "" || values.peso === null) {
        errors.peso = "El peso es obligatorio.";
      } else if (!isNumeric(values.peso)) {
        errors.peso = "El peso debe ser un número válido (ej. 70.5).";
      } else if (Number(values.peso) <= 0) {
        errors.peso = "El peso debe ser mayor que 0.";
      }
    }
    if (values.fecha !== undefined) {
      if (!values.fecha) errors.fecha = "La fecha es obligatoria.";
      else if (isNaN(new Date(values.fecha).getTime())) errors.fecha = "Fecha inválida.";
    }
    if (values.altura !== undefined && values.altura !== "") {
      if (!isNumeric(values.altura)) errors.altura = "La altura debe ser un número válido (ej. 175.50).";
      else if (Number(values.altura) <= 20 || Number(values.altura) > 300) errors.altura = "La altura debe estar entre 20 y 300 cm.";
    }
    if (values.calorias_quemadas !== undefined && values.calorias_quemadas !== "") {
      if (!isNumeric(values.calorias_quemadas)) errors.calorias_quemadas = "Las calorías deben ser un número entero (ej. 200).";
      else if (Number(values.calorias_quemadas) < 0) errors.calorias_quemadas = "Las calorías no pueden ser negativas.";
    }

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    if (!user) return;
    // client-side validation
    if (!validateCrear()) {
      setMensaje('Corrige los errores del formulario.');
      return;
    }
  // clear any previous messages before creating
  setMensaje("");
  try {
      const payload = {
        id_usuario: user.id_usuario,
        fecha: fecha || new Date().toISOString().slice(0, 10),
        peso: peso ? Number(peso) : null,
        altura: altura ? Number(altura) : null,
        calorias_quemadas: calorias ? Number(calorias) : null,
        observaciones,
      };
      const res = await seguimientoApi.crearEntrada(payload, token);
      setMensaje("Entrada guardada");
      // actualizar lista
      setEntries((prev) => [...prev, res.data.entry]);
      setPeso("");
      setAltura("");
      setCalorias("");
      setObservaciones("");
      setFormErrors({});
    } catch (err) {
      console.error("Error crear entrada:", err);
      setMensaje(err.response?.data?.message || "Error creando entrada");
    }
  };

  // Preparar datos para la gráfica
  const chartData = {
    labels: entries.map((e) => e.fecha),
    datasets: [
      {
        label: "Peso (kg)",
        data: entries.map((e) => (e.peso !== null ? Number(e.peso) : null)),
        borderColor: "#0f5132",
        backgroundColor: "rgba(15,81,50,0.1)",
        tension: 0.2,
      },
    ],
  };

  // Calcular progreso simple: diferencia entre primer y último peso registrado
  const progreso = (() => {
    if (!entries || entries.length < 2) return null;
    const first = entries.find((e) => e.peso !== null);
    const last = [...entries].reverse().find((e) => e.peso !== null);
    if (!first || !last) return null;
    const diff = Number(last.peso) - Number(first.peso);
    let porcentaje = null;
    if (clienteInfo && clienteInfo.objetivo) {
      // Si objetivo es 'perder peso', progreso negativo significa avance
      if (clienteInfo.objetivo === "perder peso") {
        porcentaje = ((first.peso - last.peso) / first.peso) * 100;
      } else if (clienteInfo.objetivo === "ganar músculo") {
        porcentaje = ((last.peso - first.peso) / first.peso) * 100;
      } else {
        porcentaje = ((last.peso - first.peso) / first.peso) * 100;
      }
    }
    return { first: Number(first.peso), last: Number(last.peso), diff, porcentaje };
  })();

  return (
    <ErrorBoundary>
      <div className="page-container seguimiento-page">
            <div className="header-row">
            <div>
              <h2>Seguimiento</h2>
              {userInfo?.fecha_registro && 
              <div className="registro">Registro: {userInfo.fecha_registro}</div>}
            </div>
            <div>
              <Link to="/dashboard" className="btn-secondary">Volver</Link>
            </div>
              {mensaje && <p className="success">{mensaje}</p>}
          </div>

          <div className="seguimiento-grid">
            <div className="seguimiento-columns">
          {/* Left column: form/search */}
          <div>
            {user?.rol === "cliente" && (
                <div>
                  <h3>Añadir entrada</h3>
                  <form onSubmit={handleCrear} className="form-grid">
                    <div className="field">
                    <label>Peso (kg)</label>
                    <input type="number" step="0.1" value={peso} onChange={(e) => { setPeso(e.target.value); setMensaje(""); }} />
                    {formErrors.peso && <div className="error">{formErrors.peso}</div>}
                  </div>
                  <div className="field">
                    <label>Fecha</label>
                    <input type="date" value={fecha} onChange={(e) => { setFecha(e.target.value); setMensaje(""); }} />
                    {formErrors.fecha && <div className="error">{formErrors.fecha}</div>}
                  </div>
                  <div className="field">
                    <label>Altura (cm)</label>
                    <input type="number" step="0.1" value={altura} onChange={(e) => { setAltura(e.target.value); setMensaje(""); }} />
                    {formErrors.altura && <div className="error">{formErrors.altura}</div>}
                  </div>
                  <div className="field">
                    <label>Calorías quemadas</label>
                    <input type="number" value={calorias} onChange={(e) => { setCalorias(e.target.value); setMensaje(""); }} />
                    {formErrors.calorias && <div className="error">{formErrors.calorias}</div>}
                  </div>
                  <div className="field full">
                    <label>Observaciones</label>
                    <textarea value={observaciones} onChange={(e) => { setObservaciones(e.target.value); setMensaje(""); }} />
                    {formErrors.observaciones && <div className="error">{formErrors.observaciones}</div>}
                  </div>
                  <div className="field full">
                    <button type="submit" className="btn-primary">Guardar entrada</button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Middle column: entries list */}
          <div className="col-min">
            <div className="card">
              <h3>Entradas</h3>
                {entries && entries.length ? (
                  <>
                  <div className="entries-list">
                    {((showAllEntries ? entries : entries.slice(0, VISIBLE_ENTRIES)) || []).map((e) => {
                      const isInit = e.id_seguimiento === "init";
                      const isEditing = editingId === e.id_seguimiento;
                      return (
                        <div key={e.id_seguimiento || `${e.fecha}-${e.peso}`} className="entry-wrapper">
                          <div className="entry-card">
                            <div className="entry-row">
                              <div className="entry-date">{e.fecha}</div>
                              <div className="entry-peso">{e.peso !== null ? `${Number(e.peso).toFixed(1)} kg` : "-"}</div>
                            </div>

                            <div className="entry-meta">Altura: {e.altura ?? "-"} cm · Calorías: {e.calorias_quemadas ?? "-"}</div>

                            {e.observaciones && <div className="entry-observaciones"><strong>Observaciones:</strong> {e.observaciones}</div>}

                            {!isInit && (
                              <div className="controls-row">
                                {!isEditing && (
                                  <>
                                    <button className="btn-secondary btn-small" onClick={() => { setEditingId(e.id_seguimiento); setEditValues({ peso: e.peso ?? "", altura: e.altura ?? "", calorias_quemadas: e.calorias_quemadas ?? "", observaciones: e.observaciones ?? "", fecha: e.fecha }); }}>
                                      Editar
                                    </button>
                                    <button className="btn-danger btn-small" onClick={async () => {
                                      if (!confirm("¿Seguro que quieres eliminar esta entrada?")) return;
                                      try {
                                        await seguimientoApi.borrarEntrada(e.id_seguimiento, token);
                                        setEntries((prev) => prev.filter((x) => x.id_seguimiento !== e.id_seguimiento));
                                        setMensaje("Entrada eliminada");
                                      } catch (err) {
                                        console.error("Error borrando entrada:", err);
                                        setMensaje(err.response?.data?.message || "Error eliminando entrada");
                                      }
                                    }}>
                                      Eliminar
                                    </button>
                                  </>
                                )}

                                {isEditing && (
                                  <div className="inline-controls">
                                    <input className="input-small" type="number" step="0.1" value={editValues.peso} onChange={(ev) => { setEditValues((s) => ({ ...s, peso: ev.target.value })); setMensaje(""); }} />
                                    {editErrors.peso && <div className="error">{editErrors.peso}</div>}
                                    <input className="input-small" type="number" step="0.1" value={editValues.altura} onChange={(ev) => { setEditValues((s) => ({ ...s, altura: ev.target.value })); setMensaje(""); }} />
                                    {editErrors.altura && <div className="error">{editErrors.altura}</div>}
                                    <input className="input-medium" type="number" value={editValues.calorias_quemadas} onChange={(ev) => { setEditValues((s) => ({ ...s, calorias_quemadas: ev.target.value })); setMensaje(""); }} />
                                    {editErrors.calorias_quemadas && <div className="error">{editErrors.calorias_quemadas}</div>}
                                    <button className="btn-primary btn-small" onClick={async () => {
                                      // validate edit values
                                      if (!validateEdit(editValues)) {
                                        setMensaje('Corrige los errores del formulario de edición.');
                                        return;
                                      }
                                      try {
                                        const payload = { fecha: editValues.fecha, peso: editValues.peso === "" ? null : Number(editValues.peso), altura: editValues.altura === "" ? null : Number(editValues.altura), calorias_quemadas: editValues.calorias_quemadas === "" ? null : Number(editValues.calorias_quemadas), observaciones: editValues.observaciones };
                                        const res = await seguimientoApi.actualizarEntrada(e.id_seguimiento, payload, token);
                                        setEntries((prev) => prev.map((x) => (x.id_seguimiento === e.id_seguimiento ? res.data.entry : x)));
                                        setEditingId(null);
                                        setEditErrors({});
                                        setMensaje("Entrada actualizada");
                                      } catch (err) {
                                        console.error("Error actualizando:", err);
                                        setMensaje(err.response?.data?.message || "Error actualizando entrada");
                                      }
                                    }}>Guardar</button>
                                    <button className="btn-secondary btn-small" onClick={() => { setEditingId(null); setEditValues({}); }}>Cancelar</button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {entries.length > VISIBLE_ENTRIES && (
                    <div className="entries-toggle">
                      <div className="small">Mostrando {Math.min(entries.length, VISIBLE_ENTRIES)} de {entries.length} entradas</div>
                      <button className="btn-secondary btn-small" onClick={() => setShowAllEntries((s) => !s)}>{showAllEntries ? 'Ver menos' : 'Ver más'}</button>
                    </div>
                  )}
                  </>
              ) : (
                <p>No hay entradas aún</p>
              )}
            </div>
          </div>

          {/* Right column: chart + progreso */}
          <div className="right-col">
            <div className="card mb-12">
              <h3>Gráfica de peso</h3>
              {entries && entries.length ? (
                <ChartWrapper data={chartData} />
              ) : (
                <p>No hay entradas aún</p>
              )}

              <div className="objetivo-display" style={{ marginTop: 12 }}>
                <strong>Objetivo:</strong>{' '}
                {!objetivoEditing && (
                  <>
                    <span className="objetivo-badge">{normalizeObjetivo(objetivoValue) || 'No definido'}</span>
                    {canEditObjetivo() && (
                      <button className="btn-secondary btn-small" style={{ marginLeft: 8 }} onClick={() => setObjetivoEditing(true)}>Editar</button>
                    )}
                  </>
                )}

                {objetivoEditing && (
                  <div className="objetivo-edit" style={{ marginTop: 8 }}>
                    <select value={objetivoValue || ''} onChange={(e) => setObjetivoValue(e.target.value)}>
                      <option value="">-- seleccione --</option>
                      <option value="perder peso">perder peso</option>
                      <option value="ganar músculo">ganar músculo</option>
                      <option value="mejorar resistencia">mejorar resistencia</option>
                      <option value="otro">otro</option>
                    </select>
                    <div style={{ marginTop: 8 }}>
                      <button className="btn-primary btn-small" onClick={handleSaveObjetivo}>Guardar</button>
                      <button className="btn-secondary btn-small" style={{ marginLeft: 8 }} onClick={() => { setObjetivoEditing(false); setObjetivoValue(normalizeObjetivo(clienteInfo?.objetivo)); }}>Cancelar</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {progreso && (
              <div className="card">
                <h3>Progreso</h3>
                <p>
                  Peso inicial: {progreso.first} kg — Último: {progreso.last} kg — Cambio: {progreso.diff.toFixed(2)} kg
                </p>
                {progreso.porcentaje !== null && (
                  <p>Progreso relativo: {progreso.porcentaje.toFixed(2)}%</p>
                )}
              </div>
            )}

           
          </div>
        </div>
      </div>
      </div>
    </ErrorBoundary>
  );
};

export default Seguimiento;
