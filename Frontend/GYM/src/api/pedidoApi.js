// src/api/pedidoApi.js
import axios from "axios";

// Realizar pedido
export const realizarPedido = async () => {
  const token = localStorage.getItem("token"); // o donde guardes el token
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
