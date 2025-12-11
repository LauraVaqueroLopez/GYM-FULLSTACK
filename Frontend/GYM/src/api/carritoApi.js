import axios from "axios";

const API_URL = "http://localhost:4000/api/carrito";

// Obtener carrito completo
export const obtenerCarrito = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};

// Agregar producto al carrito
export const agregarProducto = async (id_producto, cantidad = 1) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    API_URL,
    { id_producto, cantidad },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};

// Eliminar producto completo del carrito
export const eliminarProducto = async (id_producto) => {
  const token = localStorage.getItem("token");

  const res = await axios.delete(`${API_URL}/${id_producto}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};

// Eliminar una unidad del producto del carrito
export const eliminarUnidad = async (id_producto) => {
  const token = localStorage.getItem("token");

  const res = await axios.patch(
    `${API_URL}/eliminar-unidad/${id_producto}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  return res.data;
};
