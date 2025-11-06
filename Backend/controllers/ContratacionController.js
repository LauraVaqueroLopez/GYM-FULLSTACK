// controllers/ContratacionController.js
import Contratacion from "../models/Contratacion.js";
import Cliente from "../models/Cliente.js";
import Entrenador from "../models/Entrenador.js";
import Usuario from "../models/Usuario.js";

/**
 * ✅ Contratar un entrenador (solo clientes)
 */
export const contratarEntrenador = async (req, res) => {
  try {
    const { id_entrenador } = req.body;
    const user = req.user; // viene del middleware verifyToken

    if (!user || user.rol !== "cliente") {
      return res.status(403).json({ message: "Solo los clientes pueden contratar entrenadores" });
    }

    // Buscar el cliente asociado al usuario autenticado
    const cliente = await Cliente.findOne({ where: { id_usuario: user.id_usuario } });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Verificar existencia del entrenador
    const entrenador = await Entrenador.findByPk(id_entrenador);
    if (!entrenador) {
      return res.status(404).json({ message: "Entrenador no encontrado" });
    }

    // Evitar duplicados
    const existente = await Contratacion.findOne({
      where: { id_cliente: cliente.id_cliente, id_entrenador, estado: "activa" },
    });

    if (existente) {
      return res.status(400).json({ message: "Ya tienes una contratación activa con este entrenador" });
    }

    // Crear nueva contratación
    const nueva = await Contratacion.create({
      id_cliente: cliente.id_cliente,
      id_entrenador,
    });

    res.status(201).json({
      message: "✅ Entrenador contratado correctamente",
      contratacion: nueva,
    });
  } catch (error) {
    console.error("❌ Error al contratar entrenador:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * ✅ Obtener las contrataciones de un cliente autenticado
 */
export const obtenerContratacionesCliente = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.rol !== "cliente") {
      return res.status(403).json({ message: "Solo los clientes pueden ver sus contrataciones" });
    }

    const cliente = await Cliente.findOne({ where: { id_usuario: user.id_usuario } });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const contrataciones = await Contratacion.findAll({
      where: { id_cliente: cliente.id_cliente },
      include: [{ model: Entrenador, include: [Usuario] }],
    });

    res.json(contrataciones);
  } catch (error) {
    console.error("❌ Error al obtener contrataciones:", error);
    res.status(500).json({ message: "Error al obtener contrataciones" });
  }
};

/**
 * ✅ Cancelar una contratación
 */
export const cancelarContratacion = async (req, res) => {
  try {
    const { id } = req.params;
    const contratacion = await Contratacion.findByPk(id);
    if (!contratacion) {
      return res.status(404).json({ message: "Contratación no encontrada" });
    }

    contratacion.estado = "cancelada";
    await contratacion.save();

    res.json({ message: "Contratación cancelada correctamente" });
  } catch (error) {
    console.error("❌ Error al cancelar contratación:", error);
    res.status(500).json({ message: "Error al cancelar contratación" });
  }
};

/**
 * ✅ Obtener lista de entrenadores disponibles
 */
export const getEntrenadores = async (req, res) => {
  try {
    const entrenadores = await Entrenador.findAll({
      include: [
        {
          model: Usuario,
          attributes: ["nombre", "apellidos", "email"],
        },
      ],
    });

    if (!entrenadores.length) {
      return res.status(404).json({ message: "No hay entrenadores disponibles" });
    }

    res.json(entrenadores);
  } catch (error) {
    console.error("❌ Error al obtener entrenadores:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
