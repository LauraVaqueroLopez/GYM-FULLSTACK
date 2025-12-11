import Carrito from "../models/Carrito.js";
import Producto from "../models/Producto.js";

/**
 * Añadir producto al carrito y descontar stock
 */
export const agregarProductoCarrito = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const { id_producto, cantidad } = req.body;
    const cant = cantidad || 1;

    if (!id_usuario) return res.status(400).json({ message: "Usuario no válido" });
    if (!id_producto) return res.status(400).json({ message: "Producto no válido" });

    const producto = await Producto.findByPk(id_producto);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    if (producto.stock < cant) return res.status(400).json({ message: "No hay stock suficiente" });

    let item = await Carrito.findOne({ where: { id_usuario, id_producto } });

    if (item) {
      item.cantidad += cant;
      await item.save();
    } else {
      item = await Carrito.create({
        id_usuario,
        id_producto,
        cantidad: cant,
      });
    }

    // Actualizar stock
    producto.stock -= cant;
    await producto.save();

    // Incluir Producto al obtener carrito
    const carrito = await Carrito.findAll({
      where: { id_usuario },
      include: [{ model: Producto }],
    });

    res.json({ message: "Producto agregado al carrito", carrito });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ message: "Error al agregar producto" });
  }
};

/**
 * Obtener carrito
 */
export const obtenerCarrito = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;

    const carrito = await Carrito.findAll({
      where: { id_usuario },
      include: [{ model: Producto }],
    });

    res.json(carrito);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ message: "Error al obtener carrito" });
  }
};

/**
 * Eliminar producto completo del carrito y devolver stock
 */
export const eliminarProductoCarrito = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const { id_producto } = req.params;

    const item = await Carrito.findOne({ where: { id_usuario, id_producto } });
    if (!item) return res.status(404).json({ message: "Producto no encontrado en el carrito" });

    // Devolver stock
    const producto = await Producto.findByPk(id_producto);
    if (producto) {
      producto.stock += item.cantidad;
      await producto.save();
    }

    await item.destroy();

    res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};

/**
 * Eliminar una unidad del producto del carrito y devolver stock
 */
export const eliminarUnidadProducto = async (req, res) => {
  try {
    const id_usuario = req.user.id_usuario;
    const { id_producto } = req.params;

    const item = await Carrito.findOne({ where: { id_usuario, id_producto } });
    if (!item) return res.status(404).json({ message: "Producto no encontrado en el carrito" });

    const producto = await Producto.findByPk(id_producto);

    if (item.cantidad > 1) {
      item.cantidad -= 1;
      await item.save();
      if (producto) {
        producto.stock += 1;
        await producto.save();
      }
    } else {
      await item.destroy();
      if (producto) {
        producto.stock += 1;
        await producto.save();
      }
    }

    const carrito = await Carrito.findAll({
      where: { id_usuario },
      include: [{ model: Producto }],
    });

    res.json({ message: "Unidad eliminada del carrito", carrito });
  } catch (error) {
    console.error("Error al eliminar unidad:", error);
    res.status(500).json({ message: "Error al eliminar unidad" });
  }
};
