import axios from "axios";

const API_URL = "http://localhost:4000/api/resenas";

export const getResenasPorEntrenador = async (id_entrenador_userid) => {
  const res = await axios.get(`${API_URL}/entrenador/${encodeURIComponent(id_entrenador_userid)}`);
  return res.data;
};

export const crearResenia = async (payload) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token");
  const res = await axios.post(API_URL, payload, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export default { getResenasPorEntrenador, crearResenia };
