import axios from "axios";

const API_URL = "http://localhost:4000/api/contrataciones";

// Obtener lista de entrenadores del cliente autenticado
export const getEntrenadores = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación. Inicia sesión de nuevo.");

  try {
    const res = await axios.get(`${API_URL}/entrenadores`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("Error al obtener entrenadores:", error.response?.data || error);
    return [];
  }
};

// Contratar un entrenador (solo clientes)
export const contratarEntrenador = async (id_entrenador) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación. Inicia sesión de nuevo.");

  const res = await axios.post(
    `${API_URL}/contratar`,
    { id_entrenador },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  try {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("contratacionesUpdated", { detail: res.data }));
    }
  } catch (e) {
    // no crítico
  }

  return res.data;
};

export const getMisContrataciones = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación. Inicia sesión de nuevo.");
  
  const res = await axios.get(`${API_URL}/mis-contrataciones`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const cancelarContratacion = async (idContratacion) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación. Inicia sesión de nuevo.");
  
  const res = await axios.put(`${API_URL}/cancelar/${encodeURIComponent(idContratacion)}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

  try {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("contratacionesUpdated", { detail: res.data }));
    }
  } catch (e) {
  }
  return res.data;
};
