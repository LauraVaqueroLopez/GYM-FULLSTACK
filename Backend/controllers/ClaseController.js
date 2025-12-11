// controllers/ClaseController.js
import { Op } from "sequelize";
import Clase from "../models/Clase.js";
import Usuario from "../models/Usuario.js";

/**
 * Crear clases diarias durante 1 año
 * El id_entrenador se obtiene automáticamente del token
 */
export const crearClasesTodoAno = async (req, res) => {
  try {
    const { nombre_clase, descripcion, horaInicio, horaFin } = req.body;

    // 🔥 Obtener id_entrenador desde el token
    // Ahora usamos id_usuario directamente
    const id_entrenador = req.user.id_usuario;

    if (!id_entrenador) {
      return res.status(401).json({ message: "No se pudo obtener el entrenador desde el token" });
    }

    if (!nombre_clase || !horaInicio || !horaFin) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // Verificar que el usuario existe y es entrenador
    const usuario = await Usuario.findByPk(id_entrenador);
    if (!usuario || usuario.rol !== "entrenador") {
      return res.status(403).json({ message: "Usuario no es un entrenador válido" });
    }

    // Generar clases durante 1 año
    const hoy = new Date();
    const fin = new Date();
    fin.setFullYear(fin.getFullYear() + 1);

    const clasesCrear = [];

    for (let d = new Date(hoy); d <= fin; d.setDate(d.getDate() + 1)) {
      const fechaStr = d.toISOString().split("T")[0];

      clasesCrear.push({
        nombre_clase,
        descripcion,
        id_entrenador,   // id_usuario del entrenador
        fecha: fechaStr,
        hora: horaInicio,
        hora_fin: horaFin,
        plazas_disponibles: 10
      });
    }

    await Clase.bulkCreate(clasesCrear);

    res.status(201).json({
      message: "Clases creadas correctamente para todo el año",
      total_generadas: clasesCrear.length
    });

  } catch (error) {
    console.error("❌ Error al crear clases:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/**
 * Listar clases de un entrenador
 */
export const obtenerClasesEntrenador = async (req, res) => {
  try {
    const { id_entrenador } = req.params;

    const clases = await Clase.findAll({
      where: { id_entrenador },
      order: [["fecha", "ASC"], ["hora", "ASC"]],
      include: [{ model: Usuario }]
    });

    res.json(clases);
  } catch (error) {
    console.error("❌ Error al obtener clases:", error);
    res.status(500).json({ message: "Error al obtener clases" });
  }
};

/**
 * Obtener días disponibles
 */
export const obtenerDiasDisponibles = async (req, res) => {
  try {
    const { id_entrenador } = req.params;

    const clases = await Clase.findAll({
      where: { id_entrenador },
      attributes: ["fecha"],
      group: ["fecha"],
      order: [["fecha", "ASC"]]
    });

    const dias = clases.map(c => c.fecha);
    res.json(dias);
  } catch (error) {
    console.error("❌ Error al obtener días:", error);
    res.status(500).json({ message: "Error interno" });
  }
};

/**
 * Obtener horas disponibles en un día
 */
export const obtenerHorasDisponibles = async (req, res) => {
  try {
    const { id_entrenador, fecha } = req.params;

    const clases = await Clase.findAll({
      where: {
        id_entrenador,
        fecha,
        plazas_disponibles: { [Op.gt]: 0 }
      },
      attributes: ["id_clase", "hora", "hora_fin", "plazas_disponibles"],
      order: [["hora", "ASC"]]
    });

    res.json(clases);
  } catch (error) {
    console.error("❌ Error al obtener horas:", error);
    res.status(500).json({ message: "Error interno" });
  }
};
