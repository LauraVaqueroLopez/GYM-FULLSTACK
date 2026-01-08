import express from "express";
import Seguimiento from "../models/Seguimiento.js";
import Usuario from "../models/Usuario.js";
import Cliente from "../models/Cliente.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No autorizado" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

// Crear una entrada de seguimiento (cliente)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { id_usuario, fecha, peso, altura, calorias_quemadas, observaciones } = req.body;

    if (req.user.rol === "cliente" && req.user.id_usuario !== id_usuario) {
      return res.status(403).json({ message: "No puedes crear entradas para otros usuarios" });
    }

    const entry = await Seguimiento.create({
      id_usuario,
      fecha: fecha || null,
      peso: peso || null,
      altura: altura || null,
      calorias_quemadas: calorias_quemadas || null,
      observaciones: observaciones || null,
    });

    return res.status(201).json({ message: "Entrada creada", entry });
  } catch (error) {
    console.error("Error creando seguimiento:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

// Obtener entradas por id de usuario
router.get("/usuario/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.rol === "cliente" && req.user.id_usuario !== id) {
      return res.status(403).json({ message: "No autorizado para ver estas entradas" });
    }

    const entries = await Seguimiento.findAll({ where: { id_usuario: id }, order: [["fecha", "ASC"]] });
    const cliente = await Cliente.findOne({ where: { id_usuario: id } });
    const user = await Usuario.findByPk(id);
    return res.status(200).json({ entries, cliente, user: user ? { id_usuario: user.id_usuario, nombre: user.nombre, apellidos: user.apellidos, dni: user.dni, fecha_registro: user.fecha_registro } : null });
  } catch (error) {
    console.error("Error obteniendo entradas:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

router.get("/dni/:dni", authMiddleware, async (req, res) => {
  try {
    if (req.user.rol !== "entrenador" && req.user.rol !== "admin") {
      return res.status(403).json({ message: "Sólo entrenadores pueden acceder por DNI" });
    }
    const { dni } = req.params;
    const normalizedDni = String(dni || "").trim().replace(/[-\s]/g, "").toUpperCase();
    const user = await Usuario.findOne({ where: { dni: normalizedDni } });
    if (!user) return res.status(404).json({ message: "Cliente no encontrado" });
    const entries = await Seguimiento.findAll({ where: { id_usuario: user.id_usuario }, order: [["fecha", "ASC"]] });
    const cliente = await Cliente.findOne({ where: { id_usuario: user.id_usuario } });
    return res.status(200).json({ user: { id_usuario: user.id_usuario, nombre: user.nombre, apellidos: user.apellidos, dni: user.dni, fecha_registro: user.fecha_registro }, cliente, entries });
  } catch (error) {
    console.error("Error obteniendo por DNI:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

// Actualizar una entrada por id
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, peso, altura, calorias_quemadas, observaciones } = req.body;

    const entry = await Seguimiento.findByPk(id);
    if (!entry) return res.status(404).json({ message: "Entrada no encontrada" });

    // Si es cliente, solo puede modificar sus propias entradas
    if (req.user.rol === "cliente" && req.user.id_usuario !== entry.id_usuario) {
      return res.status(403).json({ message: "No puedes editar esta entrada" });
    }

    // actualizar campos permitidos
    entry.fecha = fecha || entry.fecha;
    entry.peso = peso !== undefined ? peso : entry.peso;
    entry.altura = altura !== undefined ? altura : entry.altura;
    entry.calorias_quemadas = calorias_quemadas !== undefined ? calorias_quemadas : entry.calorias_quemadas;
    entry.observaciones = observaciones !== undefined ? observaciones : entry.observaciones;

    await entry.save();
    return res.status(200).json({ message: "Entrada actualizada", entry });
  } catch (error) {
    console.error("Error actualizando entrada:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

// Eliminar una entrada por id
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await Seguimiento.findByPk(id);
    if (!entry) return res.status(404).json({ message: "Entrada no encontrada" });

    if (req.user.rol === "cliente" && req.user.id_usuario !== entry.id_usuario) {
      return res.status(403).json({ message: "No puedes eliminar esta entrada" });
    }

    await entry.destroy();
    return res.status(200).json({ message: "Entrada eliminada" });
  } catch (error) {
    console.error("Error eliminando entrada:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

// Actualizar objetivo del cliente por id_usuario
router.put('/cliente/:idUsuario', authMiddleware, async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const { objetivo } = req.body;

    // permitir solo al cliente o entrenador correspondientes editar
    if (req.user.rol === 'cliente' && req.user.id_usuario !== idUsuario) {
      return res.status(403).json({ message: 'No puedes editar el objetivo de otro usuario' });
    }

    const cliente = await Cliente.findOne({ where: { id_usuario: idUsuario } });
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

    // Validar objetivo si se proporciona
    const allowed = ['perder peso', 'ganar músculo', 'mejorar resistencia', 'otro'];
    if (objetivo !== undefined && objetivo !== null && !allowed.includes(objetivo)) {
      return res.status(400).json({ message: 'Valor de objetivo inválido' });
    }

    cliente.objetivo = objetivo === '' ? null : objetivo;
    await cliente.save();
    return res.status(200).json({ message: 'Objetivo actualizado', cliente });
  } catch (err) {
    console.error('Error actualizando objetivo:', err);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;
