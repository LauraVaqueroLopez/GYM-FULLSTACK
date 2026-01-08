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
      setCarrito([]); 
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
<div className="carrito-container">
  <div className="carrito-header">
    <h1>Carrito</h1>
    <div>
      <button onClick={() => navigate("/tienda")} className="btn-secondary">
        Volver a la tienda
      </button>
      <button onClick={handleRealizarPedido} className="btn-primary" style={{ marginLeft: "8px" }}>
        Realizar pedido
      </button>
    </div>
  </div>

  {errorMensaje && <p style={{ color: "red" }}>{errorMensaje}</p>}

  {carrito.length === 0 ? (
    <p>El carrito está vacío</p>
  ) : (
    <div className="producto">
      {carrito.map((item) => (
        <div key={item.id_carrito}>
          <h3>{item.Producto.nombre}</h3>
          <p>Cantidad: {item.cantidad}</p>
          <p>Precio unitario: ${item.Producto.precio}</p>
          <p>Total: ${item.cantidad * item.Producto.precio}</p>
          <div className="inline-controls">
            <button onClick={() => handleEliminarUnidad(item.id_producto)} className="btn-small btn-secondary">
              Eliminar 1
            </button>
            <button onClick={() => handleEliminar(item.id_producto)} className="btn-small btn-danger">
              Eliminar todo
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

  );
};

export default Carrito;
