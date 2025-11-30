import axios from "axios";

const API_URL = "http://localhost:4000/api/contrataciones";

// Obtener lista de entrenadores
export const getEntrenadores = async () => {
  const res = await axios.get(`${API_URL}/entrenadores`);
  return res.data;
};

// Contratar un entrenador (solo clientes)
export const contratarEntrenador = async (id_entrenador) => {
  // Obtener token del almacenamiento local
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No hay token de autenticación. Inicia sesión de nuevo.");
  }

  // Llamada autenticada al backend
  const res = await axios.post(
    `${API_URL}/contratar`,
    { id_entrenador },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  // Emitir evento global para notificar a otros componentes que las contrataciones han cambiado
  try {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("contratacionesUpdated", { detail: res.data }));
    }
  } catch (e) {
    // no crítico
  }

  return res.data;
};

// Obtener las contrataciones del cliente autenticado
export const getMisContrataciones = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación. Inicia sesión de nuevo.");
  const res = await axios.get(`${API_URL}/mis-contrataciones`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Cancelar una contratación por id
export const cancelarContratacion = async (idContratacion) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación. Inicia sesión de nuevo.");
  const res = await axios.put(`${API_URL}/cancelar/${encodeURIComponent(idContratacion)}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Emitir evento global para notificar a otros componentes que las contrataciones han cambiado
  try {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("contratacionesUpdated", { detail: res.data }));
    }
  } catch (e) {
    // no crítico
  }
  return res.data;
};