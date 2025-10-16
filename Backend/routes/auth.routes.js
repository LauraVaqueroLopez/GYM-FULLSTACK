import express from "express";
import Usuario from "../models/Usuario.js";
import Cliente from "../models/Cliente.js";
import Entrenador from "../models/Entrenador.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

/* =========================
   REGISTER
========================= */
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

  // Crear usuario (guardar DNI normalizado)
  const newUser = await Usuario.create({ nombre, apellidos, email, dni: normalizedDni, rol });

    // Crear registro en Clientes o Entrenadores con campos adicionales si se proporcionan
    if (rol === "cliente") {
      const { fecha_nacimiento = null, peso = null, altura = null, objetivo = null } = req.body;
      await Cliente.create({
        id_usuario: newUser.id_usuario,
        fecha_nacimiento: fecha_nacimiento || null,
        peso: peso || null,
        altura: altura || null,
        objetivo: objetivo || null,
      });
    } else if (rol === "entrenador") {
      const { especialidad = null, experiencia = null, descripcion = null } = req.body;
      await Entrenador.create({
        id_usuario: newUser.id_usuario,
        especialidad: especialidad || null,
        experiencia: experiencia !== undefined && experiencia !== null ? Number(experiencia) : null,
        descripcion: descripcion || null,
      });
    }

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id_usuario: newUser.id_usuario,
        nombre: newUser.nombre,
        apellidos: newUser.apellidos,
        email: newUser.email,
        rol: newUser.rol,
      },
    });
  } catch (error) {
    console.error("Error en /register:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
});

/* =========================
   LOGIN
========================= */
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

    // Generar JWT
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
