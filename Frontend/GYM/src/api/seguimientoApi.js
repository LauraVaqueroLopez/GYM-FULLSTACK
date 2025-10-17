import axios from "axios";

const API_URL = "http://localhost:4000/api/seguimiento";

export const crearEntrada = (data, token) => {
  return axios.post(`${API_URL}/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const obtenerPorUsuario = (idUsuario, token) => {
  return axios.get(`${API_URL}/usuario/${idUsuario}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const obtenerPorDni = (dni, token) => {
  return axios.get(`${API_URL}/dni/${encodeURIComponent(dni)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const actualizarEntrada = (id, data, token) => {
  return axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const borrarEntrada = (id, token) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default { crearEntrada, obtenerPorUsuario, obtenerPorDni, actualizarEntrada, borrarEntrada };
