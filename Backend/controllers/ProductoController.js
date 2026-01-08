// controllers/ProductoController.js
import Producto from "../models/Producto.js";

/*Obtener todos los productos*/
export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll({ order: [["nombre", "ASC"]] });
    res.json(productos);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/*Crear producto (solo admin)*/
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    if (!nombre || !precio) return res.status(400).json({ message: "Faltan datos" });

    const producto = await Producto.create({ nombre, descripcion, precio, stock });
    res.status(201).json({ message: "Producto creado", producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno" });
  }
};
