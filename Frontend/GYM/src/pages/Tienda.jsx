import React, { useEffect, useState } from "react";
import { obtenerProductos } from "../api/productoApi";
import { agregarProducto } from "../api/carritoApi";
import { useNavigate } from "react-router-dom";

const Tienda = () => {
  const [productos, setProductos] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState("");
  const navigate = useNavigate();

  // Cargar productos
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

  // Agregar producto al carrito
  const handleAgregar = async (id_producto) => {
    try {
      await agregarProducto(id_producto, 1);
      setErrorMensaje(""); // borrar mensaje si todo OK
      alert("Producto agregado al carrito");
    } catch (error) {
      console.error("Error al agregar producto:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMensaje(error.response.data.message);
      } else {
        setErrorMensaje("No se pudo agregar el producto al carrito");
      }
    }
  };

  return (
    <div>
      <h1>Tienda</h1>
      <div style={{ marginBottom: "16px" }}>
        <button onClick={() => navigate("/Dashboard")}>Volver a la página principal</button>{" "}
        <button onClick={() => navigate("/carrito")}>Ir al carrito</button>
      </div>

      {errorMensaje && <p style={{ color: "red" }}>{errorMensaje}</p>}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {productos.map((producto) => (
          <div
            key={producto.id_producto}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              margin: "8px",
              width: "200px",
            }}
          >
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <p>Stock: {producto.stock}</p>
            <button onClick={() => handleAgregar(producto.id_producto)}>
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tienda;
