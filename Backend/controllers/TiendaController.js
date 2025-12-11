// controllers/TiendaController.js
import Producto from "../models/Producto.js";
import Carrito from "../models/Carrito.js";
import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js";
import Cliente from "../models/Cliente.js";

export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (err) {
    console.error("Error obteniendo productos:", err);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

export const crearPedido = async (req, res) => {
  try {
    const id_usuario = req.user.id;

    // Verificar que el usuario sea cliente
    const cliente = await Cliente.findOne({
      where: { id_usuario }
    });

    if (!cliente) {
      return res.status(403).json({ message: "Solo los clientes pueden realizar pedidos" });
    }

    const id_cliente = cliente.id_cliente;

    // Obtener carrito del cliente
    const carrito = await Carrito.findAll({
      where: { id_cliente },
      include: [Producto]
    });

    if (!carrito || carrito.length === 0) {
      return res.status(400).json({ message: "Tu carrito está vacío" });
    }

    // Calcular total del pedido
    const total = carrito.reduce((suma, item) => {
      return suma + item.cantidad * item.Producto.precio;
    }, 0);

    // Crear pedido
    const pedido = await Pedido.create({
      id_cliente,
      total
    });

    // Crear detalles del pedido
    for (const item of carrito) {
      await DetallePedido.create({
        id_pedido: pedido.id_pedido,
        id_producto: item.id_producto,
        cantidad: item.cantidad,
        subtotal: item.cantidad * item.Producto.precio
      });
    }

    // Vaciar carrito después de generar pedido
    await Carrito.destroy({ where: { id_cliente } });

    res.status(201).json({
      message: "Pedido creado correctamente",
      id_pedido: pedido.id_pedido,
      total
    });

  } catch (err) {
    console.error("Error creando pedido:", err);
    res.status(500).json({ message: "Error al crear pedido" });
  }
};

export const obtenerPedidosCliente = async (req, res) => {
  try {
    const id_usuario = req.user.id;

    const cliente = await Cliente.findOne({
      where: { id_usuario }
    });

    if (!cliente) {
      return res.status(403).json({ message: "Solo los clientes pueden ver sus pedidos" });
    }

    const pedidos = await Pedido.findAll({
      where: { id_cliente: cliente.id_cliente },
      include: [
        {
          model: DetallePedido,
          include: [Producto]
        }
      ],
      order: [["fecha_pedido", "DESC"]]
    });

    res.json(pedidos);

  } catch (err) {
    console.error("Error obteniendo pedidos:", err);
    res.status(500).json({ message: "Error al obtener pedidos del cliente" });
  }
};
