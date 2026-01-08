import axios from "axios";

const API_URL = "http://localhost:4000/api/clases"; 

// Crear clase para todo el año, usando el id del entrenador 
export const crearClase = async ({ nombre_clase, descripcion, horaInicio, horaFin }) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No hay token de autenticación.");

  try {
    const res = await axios.post(
      `${API_URL}/crear-todo-ano`,
      { nombre_clase, descripcion, horaInicio, horaFin },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.status === 201;
  } catch (error) {
    console.error("Error en crearClase:", error.response?.data || error);
    throw new Error(error.response?.data?.message || "Error creando la clase");
  }
};
