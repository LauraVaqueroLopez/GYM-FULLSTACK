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
    // Verificar duplicados
    const existEmail = await Usuario.findOne({ where: { email } });
    const existDni = await Usuario.findOne({ where: { dni } });

    if (existEmail) return res.status(400).json({ message: "Email ya registrado" });
    if (existDni) return res.status(400).json({ message: "DNI ya registrado" });

    // Crear usuario
    const newUser = await Usuario.create({ nombre, apellidos, email, dni, rol });

    // Crear registro en Clientes o Entrenadores
    if (rol === "cliente") {
      await Cliente.create({ id_usuario: newUser.id_usuario });
    } else if (rol === "entrenador") {
      await Entrenador.create({ id_usuario: newUser.id_usuario });
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

    if (user.dni !== dni) {
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
