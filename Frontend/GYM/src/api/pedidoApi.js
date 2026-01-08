// src/api/pedidoApi.js
import axios from "axios";

export const realizarPedido = async () => {
  const token = localStorage.getItem("token"); 
  const response = await axios.post(
    "http://localhost:4000/api/pedidos/realizar",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
