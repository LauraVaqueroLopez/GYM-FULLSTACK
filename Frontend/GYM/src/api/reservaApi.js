// src/api/reservaApi.js

const API_URL = "http://localhost:4000/api/reservas";

// Obtener clases disponibles para el cliente logueado en la fecha indicada
// El ID del entrenador se obtiene automáticamente en el backend (a través del cliente y la contratación)
export async function getClasesDisponibles(fecha) {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("No hay token de autenticación.");
  
  const response = await fetch(
    `${API_URL}/clases?fecha=${fecha}`, // 👈 Ahora solo se pasa la fecha
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al obtener clases disponibles");
  }
  return response.json(); // Devuelve [{id_clase, nombre_clase, hora, hora_fin, plazas_disponibles, ...}]
}

// Crear una reserva
export async function crearReserva(data) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al crear la reserva");
  }
  return response.json();
}