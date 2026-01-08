import Cliente from "../models/Cliente.js";
import Clase from "../models/Clase.js";
import Reserva from "../models/Reserva.js";
import Contratacion from "../models/Contratacion.js";
import Entrenador from "../models/Entrenador.js"; 
import Usuario from "../models/Usuario.js";
import { Op } from "sequelize"; 

export const obtenerClasesPorFecha = async (req, res) => {
  try {
    const user = req.user;
    const { fecha } = req.query; 

    if (!fecha) {
      return res.status(400).json({ message: "Debe especificar una fecha" });
    }

    if (!user || user.rol !== "cliente") {
      return res.status(403).json({ message: "Solo los clientes pueden ver clases disponibles" });
    }

    //  Obtener cliente
    const cliente = await Cliente.findOne({ where: { id_usuario: user.id_usuario } });
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });

    //  Obtener entrenador contratado
    const contratacion = await Contratacion.findOne({
      where: { id_cliente: cliente.id_cliente, estado: "activa" }
    });

    if (!contratacion) {
      return res.status(400).json({ message: "No tienes ningún entrenador contratado con el cual reservar clases." });
    }

    // Obtener el id_usuario del entrenador contratado.
    const entrenadorContratado = await Entrenador.findOne({
        where: { id_entrenador: contratacion.id_entrenador },
        attributes: ['id_usuario']
    });

    if (!entrenadorContratado) {
        return res.status(500).json({ message: "Error interno: El entrenador contratado no se pudo encontrar." });
    }
    
    const id_usuario_entrenador = entrenadorContratado.id_usuario;

    // Obtener clases de ese entrenador en esa fecha con plazas disponibles
    const clases = await Clase.findAll({
      where: { 
        id_entrenador: id_usuario_entrenador, 
        fecha,
        plazas_disponibles: { [Op.gt]: 0 } 
      },
      order: [["hora", "ASC"]],
      attributes: ["id_clase", "nombre_clase", "hora", "hora_fin", "plazas_disponibles"], 
    });

    res.json(clases);

  } catch (error) {
    console.error("❌ Error al obtener clases por fecha:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

/*Crear una reserva*/
export const reservarClase = async (req, res) => {
  try {
    const { id_clase } = req.body;
    const user = req.user;

    if (!user || user.rol !== "cliente") {
      return res.status(403).json({ message: "Solo los clientes pueden reservar clases" });
    }

    // Obtener cliente
    const cliente = await Cliente.findOne({ where: { id_usuario: user.id_usuario } });
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });

    if (!id_clase) {
      return res.status(400).json({ message: "Debe enviarse id_clase" });
    }

    // Verificar que la clase existe
    const clase = await Clase.findByPk(id_clase);
    if (!clase) return res.status(404).json({ message: "Clase no encontrada" });

    // Verificar que el cliente tiene contratado al entrenador de esa clase
    // Aquí necesitamos obtener el ID de Entrenador
    const entrenadorDelClase = await Entrenador.findOne({
        where: { id_usuario: clase.id_entrenador },
        attributes: ['id_entrenador'] 
    });

    if (!entrenadorDelClase) {
        return res.status(404).json({ message: "Entrenador de la clase no encontrado." });
    }
    
    const id_entrenador_contratacion = entrenadorDelClase.id_entrenador;

    const contratacion = await Contratacion.findOne({
      where: {
        id_cliente: cliente.id_cliente,
        id_entrenador: id_entrenador_contratacion,
        estado: "activa"
      }
    });

    if (!contratacion) {
      return res.status(403).json({ message: "No puedes reservar esta clase. No has contratado a este entrenador." });
    }

    // Evitar reservas duplicadas
    const reservaExistente = await Reserva.findOne({
      where: {
        id_cliente: cliente.id_cliente,
        id_clase
      }
    });

    if (reservaExistente) {
      return res.status(400).json({ message: "Ya has reservado esta clase" });
    }

    // Verificar plazas
    if (clase.plazas_disponibles <= 0) {
      return res.status(400).json({ message: "No quedan plazas disponibles" });
    }

    // Crear reserva
    const reserva = await Reserva.create({
      id_cliente: cliente.id_cliente,
      id_clase
    });

    // Restar una plaza
    clase.plazas_disponibles -= 1;
    await clase.save();

    res.status(201).json({
      message: "Reserva realizada correctamente",
      reserva
    });

  } catch (error) {
    console.error("❌ Error al reservar clase:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const obtenerReservasCliente = async (req, res) => {
  try {
    const user = req.user;

    if (!user || user.rol !== "cliente") {
      return res.status(403).json({ message: "Solo los clientes pueden ver sus reservas" });
    }

    const cliente = await Cliente.findOne({ where: { id_usuario: user.id_usuario } });
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });

    const reservas = await Reserva.findAll({
      where: { id_cliente: cliente.id_cliente },
      include: [
        {
          model: Clase,
          include: [
            {
              model: Usuario,
              as: 'Entrenador',
              attributes: ['nombre', 'apellidos']
            }
          ]
        }
      ]
    });

    res.json(reservas);

  } catch (error) {
    console.error("❌ Error al obtener reservas:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};