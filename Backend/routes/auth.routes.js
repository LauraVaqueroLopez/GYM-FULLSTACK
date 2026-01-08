import express from "express";
import Usuario from "../models/Usuario.js";
import Cliente from "../models/Cliente.js";
import Entrenador from "../models/Entrenador.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "../middleware/verifyToken.js";
import { ValidationError, UniqueConstraintError } from "sequelize";
import sequelize from "../config/db_connection.js";

dotenv.config();

const router = express.Router();

/* REGISTER*/
router.post("/register", async (req, res) => {
  const { nombre, apellidos = "", email, dni, rol } = req.body;

  // Validar campos obligatorios
  if (!nombre || !email || !dni || !rol) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  if (!["cliente", "entrenador"].includes(rol)) {
    return res.status(400).json({ message: "Rol inválido" });
  }

  try {
    // Normalizar DNI antes de cualquier comprobación/almacenamiento
    const normalizeDni = (raw) => String(raw || "").trim().replace(/[-\s]/g, "").toUpperCase();
    const normalizedDni = normalizeDni(dni);
    // Si es cliente y se proporcionó fecha_nacimiento, validar edad >= 16
    if (req.body && req.body.rol === "cliente") {
      const fechaNacimiento = req.body.fecha_nacimiento;
      if (fechaNacimiento) {
        const birth = new Date(fechaNacimiento);
        if (isNaN(birth.getTime())) {
          return res.status(400).json({ message: "Fecha de nacimiento inválida" });
        }
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        if (age < 16) {
          return res.status(400).json({ message: "Debes tener al menos 16 años para registrarte como cliente" });
        }
      }
    }
    // Verificar duplicados
    const existEmail = await Usuario.findOne({ where: { email } });
  const existDni = await Usuario.findOne({ where: { dni: normalizedDni } });

    if (existEmail) return res.status(400).json({ message: "Email ya registrado" });
  if (existDni) return res.status(400).json({ message: "DNI ya registrado" });

    // Crear usuario + cliente/entrenador dentro de una transacción
    const t = await sequelize.transaction();
    try {
      const newUser = await Usuario.create({ nombre, apellidos, email, dni: normalizedDni, rol }, { transaction: t });

      if (rol === "cliente") {
        const { fecha_nacimiento = null, peso = null, altura = null, objetivo = null } = req.body;

        // Generar codigo_personal (6 dígitos) y reintentar ante colisiones únicas
        const generateCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();
        let createdCliente = null;
        const maxAttempts = 200;
        let attempts = 0;

        while (!createdCliente && attempts < maxAttempts) {
          attempts++;
          const candidate = generateCodigo();
          try {
            createdCliente = await Cliente.create({
              id_usuario: newUser.id_usuario,
              fecha_nacimiento: fecha_nacimiento || null,
              peso: peso || null,
              altura: altura || null,
              objetivo: objetivo || null,
              codigo_personal: candidate,
            }, { transaction: t });
          } catch (err) {
            // Si el conflicto es por codigo_personal repetido, intentamos otro
            if (err.name === 'SequelizeUniqueConstraintError' || err instanceof UniqueConstraintError) {
              continue;
            }
            throw err;
          }
        }

        if (!createdCliente) {
          await t.rollback();
          return res.status(500).json({ message: "No se pudo generar un codigo_personal único. Intenta de nuevo más tarde." });
        }

        await t.commit();
        return res.status(201).json({
          message: "Usuario registrado correctamente",
          user: {
            id_usuario: newUser.id_usuario,
            nombre: newUser.nombre,
            apellidos: newUser.apellidos,
            email: newUser.email,
            rol: newUser.rol,
            id_cliente: createdCliente.id_cliente,
            codigo_personal: createdCliente.codigo_personal,
          },
        });
      } else {
        const { especialidad = null, experiencia = null, descripcion = null } = req.body;
        const createdEntrenador = await Entrenador.create({
          id_usuario: newUser.id_usuario,
          especialidad: especialidad || null,
          experiencia: experiencia !== undefined && experiencia !== null ? Number(experiencia) : null,
          descripcion: descripcion || null,
        }, { transaction: t });

        await t.commit();
        return res.status(201).json({
          message: "Usuario registrado correctamente",
          user: {
            id_usuario: newUser.id_usuario,
            nombre: newUser.nombre,
            apellidos: newUser.apellidos,
            email: newUser.email,
            rol: newUser.rol,
            id_entrenador: createdEntrenador.id_entrenador,
          },
        });
      }
    } catch (err) {
      await t.rollback();
      throw err;
    }
  } catch (error) {
    console.error("Error en /register:", error);
    if (error instanceof UniqueConstraintError) {
      const field = error.errors && error.errors[0] && error.errors[0].path;
      return res.status(400).json({ message: field ? `Valor duplicado en ${field}` : "Valor duplicado" });
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});

/*LOGIN*/
router.post("/login", async (req, res) => {
  const { email, dni } = req.body;

  if (!email || !dni) {
    return res.status(400).json({ message: "Faltan datos obligatorios" });
  }

  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Normalizar DNI antes de comparar: quitar espacios/guiones y pasar a mayúsculas
    const normalizeDni = (raw) =>
      String(raw || "").trim().replace(/[-\s]/g, "").toUpperCase();

    const rawUserDni = user.dni;
    const rawReqDni = dni;
    const normUserDni = normalizeDni(rawUserDni);
    const normReqDni = normalizeDni(rawReqDni);
    console.log("[DEBUG login] user.dni raw:", JSON.stringify(rawUserDni), "normalized:", normUserDni);
    console.log("[DEBUG login] req.dni raw:", JSON.stringify(rawReqDni), "normalized:", normReqDni);

    if (normUserDni !== normReqDni) {
      console.log("[DEBUG login] DNI mismatch");
      return res.status(401).json({ message: "DNI incorrecto" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET no definido en .env" });
    }

    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || "1d" }
    );

    return res.status(200).json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("Error en /login:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

export default router;

/* GET CODIGO PERSONAL (cliente autenticado) */
router.get("/me/codigo", verifyToken, async (req, res) => {
  try {
    // Buscar cliente por id_usuario
    const cliente = await Cliente.findOne({ where: { id_usuario: req.user.id_usuario } });
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });

    return res.status(200).json({ codigo_personal: cliente.codigo_personal });
  } catch (error) {
    console.error("Error en /me/codigo:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

/* BUSCAR CLIENTE POR CÓDIGO PERSONAL (entrenador/admin)*/
router.get("/cliente/codigo/:codigo", verifyToken, async (req, res) => {
  try {
    if (req.user.rol !== "entrenador" && req.user.rol !== "admin") {
      return res.status(403).json({ message: "Sólo entrenadores o admins pueden buscar por código" });
    }
    const codigo = String(req.params.codigo || "").trim();
    if (!codigo) return res.status(400).json({ message: "Código requerido" });

    const cliente = await Cliente.findOne({ where: { codigo_personal: codigo } });
    if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });

    const user = await Usuario.findByPk(cliente.id_usuario);
    if (!user) return res.status(404).json({ message: "Usuario asociado no encontrado" });

    return res.status(200).json({ user: { id_usuario: user.id_usuario, nombre: user.nombre, apellidos: user.apellidos, dni: user.dni, fecha_registro: user.fecha_registro }, cliente });
  } catch (error) {
    console.error("Error en /cliente/codigo/:codigo:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});
