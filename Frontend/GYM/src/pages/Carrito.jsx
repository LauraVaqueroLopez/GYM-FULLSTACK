// src/pages/Carrito.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerCarrito, eliminarProducto, eliminarUnidad } from "../api/carritoApi";
import { realizarPedido as apiRealizarPedido } from "../api/pedidoApi";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState("");
  const navigate = useNavigate();

  const fetchCarrito = async () => {
    try {
      const data = await obtenerCarrito();
      setCarrito(data);
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      setErrorMensaje("No se pudo cargar el carrito.");
    }
  };

  useEffect(() => {
    fetchCarrito();
  }, []);

  const handleEliminar = async (id_producto) => {
    try {
      await eliminarProducto(id_producto);
      fetchCarrito();
    } catch (error) {
      console.error(error);
      setErrorMensaje("No se pudo eliminar el producto");
    }
  };

  const handleEliminarUnidad = async (id_producto) => {
    try {
      await eliminarUnidad(id_producto);
      fetchCarrito();
    } catch (error) {
      console.error(error);
      setErrorMensaje("No se pudo eliminar la unidad");
    }
  };

  const handleRealizarPedido = async () => {
    try {
      await apiRealizarPedido();
      setCarrito([]); // Vaciar el carrito en la interfaz
      setErrorMensaje("");
      alert("Pedido realizado correctamente");
    } catch (error) {
      console.error("Error al realizar pedido:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMensaje(error.response.data.message);
      } else {
        setErrorMensaje("Error al realizar pedido");
      }
    }
  };

  return (
    <div>
      <h1>Carrito</h1>
      <button onClick={() => navigate("/tienda")}>Volver a la tienda</button>
      {errorMensaje && <p style={{ color: "red" }}>{errorMensaje}</p>}
      {carrito.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        <div>
          {carrito.map((item) => (
            <div
              key={item.id_carrito}
              style={{
                border: "1px solid #ccc",
                padding: "16px",
                margin: "8px",
                borderRadius: "8px",
              }}
            >
              <h3>{item.Producto.nombre}</h3>
              <p>Cantidad: {item.cantidad}</p>
              <p>Precio unitario: ${item.Producto.precio}</p>
              <p>Total: ${item.cantidad * item.Producto.precio}</p>
              <button onClick={() => handleEliminarUnidad(item.id_producto)}>Eliminar 1</button>
              <button onClick={() => handleEliminar(item.id_producto)}>Eliminar todo</button>
            </div>
          ))}
          <div style={{ marginTop: "16px" }}>
            <button onClick={handleRealizarPedido}>Realizar pedido</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
