import React, { useEffect, useState } from "react";
import { obtenerProductos } from "../api/productoApi";
import { agregarProducto } from "../api/carritoApi";
import { useNavigate } from "react-router-dom";

const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await obtenerProductos();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setErrorMensaje("Error al cargar productos.");
      }
    };
    fetchProductos();
  }, []);

  const handleAgregar = async (id_producto) => {
    try {
      await agregarProducto(id_producto, 1);
      setErrorMensaje("");
      alert("Producto agregado al carrito");
    } catch (error) {
      console.error("Error al agregar producto:", error);
      setErrorMensaje(error.response?.data?.message || "No se pudo agregar");
    }
  };

  return (
    <div className="tienda-page">
      <h1>Tienda</h1>
      <div className="tienda-header-buttons">
        <button className="btn-secondary" onClick={() => navigate("/Dashboard")}>Volver</button>
        <button className="btn-primary" onClick={() => navigate("/carrito")}>Ir al carrito</button>
      </div>

      {errorMensaje && <p className="error">{errorMensaje}</p>}

      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.id_producto} className="producto-card">
            <h3>{producto.nombre}</h3>
            <p className="descripcion">{producto.descripcion}</p>
            <p className="precio">Precio: ${producto.precio}</p>
            <p className="stock">Stock: {producto.stock}</p>
            <button className="btn-primary" onClick={() => handleAgregar(producto.id_producto)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tienda;