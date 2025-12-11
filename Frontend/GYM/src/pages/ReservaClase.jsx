import React, { useState } from "react";
import { getClasesDisponibles, crearReserva } from "../api/reservaApi";
import { useNavigate } from "react-router-dom"; // Importamos useNavigate

const ReservaClase = () => {
  const [fecha, setFecha] = useState("");
  const [clases, setClases] = useState([]);
  const [claseId, setClaseId] = useState("");
  const [mensaje, setMensaje] = useState("Selecciona una fecha para ver las clases de tu entrenador.");
  
  // Inicializamos el hook de navegación
  const navigate = useNavigate();

  // Función para manejar la navegación al Dashboard
  const goToDashboard = () => {
 
    navigate('/Dashboard'); 
  };

  const handleFechaChange = async (e) => {
    const nuevaFecha = e.target.value;
    setFecha(nuevaFecha);
    
    if (nuevaFecha) {
      cargarClases(nuevaFecha);
    } else {
      setClases([]);
      setClaseId("");
      setMensaje("Selecciona una fecha para ver las clases de tu entrenador.");
    }
  };

  const cargarClases = async (fechaClase) => {
    setMensaje("Cargando clases...");
    setClases([]);
    setClaseId("");
    
    try {
      const lista = await getClasesDisponibles(fechaClase); 
      setClases(lista);

      if (lista.length === 0) {
        setMensaje("No hay clases disponibles para esa fecha con tu entrenador contratado.");
      } else {
        setMensaje(`Clases encontradas para el ${fechaClase}.`);
      }
    } catch (error) {
       console.error("Error al cargar clases:", error.message);
       setMensaje(error.message || "Error al cargar las clases.");
       setClases([]);
    }
  };

  const reservar = async () => {
    if (!claseId) return alert("Selecciona una clase.");

    try {
      await crearReserva({ id_clase: claseId });
      alert("Reserva realizada correctamente.");
      cargarClases(fecha); 
    } catch (error) {
      alert(error.message || "Error al reservar.");
    }
  };

  return (
    <div>
      <button onClick={goToDashboard} style={{ marginBottom: '20px', padding: '10px 15px', cursor: 'pointer' }}>
         Volver
      </button>
      
      <h2>Reservar Clase</h2>

      <label>Fecha:</label>
      <input 
        type="date" 
        value={fecha} 
        onChange={handleFechaChange}
      />

      <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{mensaje}</p>
      
      <br />

      <label>Clases disponibles:</label>
      <select 
        value={claseId} 
        onChange={(e) => setClaseId(e.target.value)}
        disabled={clases.length === 0}
      >
        <option value="">Selecciona una clase</option>
        {clases.map((c) => (
          <option key={c.id_clase} value={c.id_clase}>
            {c.hora ? c.hora.slice(0,5) : ''} - {c.hora_fin ? c.hora_fin.slice(0,5) : ''} · {c.nombre_clase} ({c.plazas_disponibles} plazas)
          </option>
        ))}
      </select>

      <br /><br />

      <button onClick={reservar} disabled={!claseId}>Reservar</button>
    </div>
  );
};

export default ReservaClase;