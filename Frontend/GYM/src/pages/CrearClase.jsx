import React, { useState } from "react";
import { crearClase } from "../api/claseApi";

const CrearClase = () => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [horaInicio, setHoraInicio] = useState("09:00");
  const [horaFin, setHoraFin] = useState("10:00");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const crear = async () => {
    setMensaje("");
    setError("");

    if (!nombre || !horaInicio || !horaFin) {
      setError("Completa todos los campos.");
      return;
    }

    try {
      const ok = await crearClase({ nombre_clase: nombre, descripcion, horaInicio, horaFin });
      if (ok) {
        setMensaje("✅ Clase creada correctamente para todo el año.");
        setError("");
      } else {
        setError("Error al crear la clase.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container">
      <h2>Crear Clase</h2>

      <label>Nombre clase:</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <br /><br />

      <label>Descripción:</label>
      <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <br /><br />

      <label>Hora inicio:</label>
      <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />

      <br /><br />

      <label>Hora fin:</label>
      <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />

      <br /><br />

      <button onClick={crear}>Crear clases para todo el año</button>

      {mensaje && <p className="success">{mensaje}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CrearClase;
