import axios from "axios";

const API_URL = "http://localhost:4000/api/auth";

export const loginRequest = (email, dni) => {
  return axios.post(`${API_URL}/login`, { email, dni });
};

export const registerRequest = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const getCodigoPersonal = (token) => {
  return axios.get(`${API_URL}/me/codigo`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getClienteByCodigo = (codigo, token) => {
  return axios.get(`${API_URL}/cliente/codigo/${encodeURIComponent(codigo)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
