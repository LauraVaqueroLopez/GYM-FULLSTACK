import axios from "axios";

const API_URL = "http://localhost:4000/api/auth"; // Asegúrate que coincide con tu backend

export const loginRequest = (email, dni) => {
  return axios.post(`${API_URL}/login`, { email, dni });
};

export const registerRequest = (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};
