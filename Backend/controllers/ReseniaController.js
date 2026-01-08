import Resenia from "../models/Resenia.js";
import Usuario from "../models/Usuario.js";
import Entrenador from "../models/Entrenador.js";
import Cliente from "../models/Cliente.js";
import Contratacion from "../models/Contratacion.js";
import { Op } from "sequelize";

export const getResenasPorEntrenador = async (req, res) => {
  try {
    const { id } = req.params; 
    const resenas = await Resenia.findAll({
      where: { id_entrenador: id },
      include: [{ model: Usuario, as: "autor", attributes: ["id_usuario", "nombre", "apellidos"] }],
      order: [["fecha", "DESC"]],
    });
    res.json(resenas);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

export const crearResenia = async (req, res) => {
  try {
    const user = req.user;
    if (!user || user.rol !== "cliente") return res.status(403).json({ message: "Solo los clientes pueden escribir reseñas" });

    const { id_entrenador, puntuacion, comentario } = req.body; 
    // buscar cliente
    const cliente = await Cliente.findOne({ where: { id_usuario: user.id_usuario } });
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });

    // buscar entrenador (tabla Entrenador) por id_usuario
    const entrenadorRecord = await Entrenador.findOne({ where: { id_usuario: id_entrenador } });
    if (!entrenadorRecord) return res.status(404).json({ message: "Entrenador no encontrado" });

    // comprobar que el cliente ha contratado a ese entrenador alguna vez (no cancelada)
    const contratacion = await Contratacion.findOne({
      where: { id_cliente: cliente.id_cliente, id_entrenador: entrenadorRecord.id_entrenador, estado: { [Op.ne]: "cancelada" } },
    });
    if (!contratacion) return res.status(403).json({ message: "Solo puedes reseñar a entrenadores que has contratado" });

    // Evitar reseñas duplicadas: solo una reseña por cliente y entrenador
    const existente = await Resenia.findOne({ where: { id_usuario: user.id_usuario, id_entrenador } });
    if (existente) return res.status(400).json({ message: "Ya has escrito una reseña para este entrenador" });

    const nueva = await Resenia.create({ id_usuario: user.id_usuario, id_entrenador, puntuacion, comentario });
    res.status(201).json({ message: "Reseña creada", resenia: nueva });
  } catch (error) {
    console.error("Error al crear reseña:", error);
    res.status(500).json({ message: "Error al crear reseña" });
  }
};
