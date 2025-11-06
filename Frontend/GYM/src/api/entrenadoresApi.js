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

  return res.data;
};