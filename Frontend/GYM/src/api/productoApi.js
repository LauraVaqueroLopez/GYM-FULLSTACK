// src/api/productoApi.js
import axios from "axios";

const API_URL = "http://localhost:4000/api/productos";

export const obtenerProductos = async () => {
  const token = localStorage.getItem("token");
  
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};
