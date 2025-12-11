// controllers/PedidoController.js
import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";
import Carrito from "../models/Carrito.js";
import Cliente from "../models/Cliente.js";
import Producto from "../models/Producto.js";
import sequelize from "../config/db_connection.js";

/**
 * Realizar pedido: convierte todo el carrito en un pedido
 */
export const realizarPedido = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const id_usuario = req.user.id_usuario;
    if (!id_usuario) return res.status(400).json({ message: "Usuario no válido" });

    // Obtener id_cliente a partir del usuario
    const cliente = await Cliente.findOne({ where: { id_usuario } });
    if (!cliente) return res.status(400).json({ message: "Cliente no válido" });
    const id_cliente = cliente.id_cliente;

    // Obtener carrito con productos
    const carritoItems = await Carrito.findAll({
      where: { id_usuario },
      include: [Producto],
      transaction: t,
    });

    if (carritoItems.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "El carrito está vacío" });
    }

    // Calcular total
    const total = carritoItems.reduce(
      (sum, item) => sum + item.cantidad * item.Producto.precio,
      0
    );

    // Crear pedido
    const pedido = await Pedido.create(
      {
        id_cliente,
        total,
        fecha_pedido: new Date(),
        estado: "pendiente",
      },
      { transaction: t }
    );

    // Crear detalles del pedido y actualizar stock
    for (const item of carritoItems) {
      await DetallePedido.create(
        {
          id_pedido: pedido.id_pedido,
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          subtotal: item.cantidad * item.Producto.precio,
        },
        { transaction: t }
      );

      // Reducir stock del producto
      item.Producto.stock -= item.cantidad;
      if (item.Producto.stock < 0) item.Producto.stock = 0;
      await item.Producto.save({ transaction: t });
    }

    // Vaciar carrito
    await Carrito.destroy({ where: { id_usuario }, transaction: t });

    await t.commit();
    res.json({ message: "Pedido realizado correctamente", pedido });
  } catch (error) {
    await t.rollback();
    console.error("Error al realizar pedido:", error);
    res.status(500).json({ message: "Error al realizar pedido" });
  }
};
