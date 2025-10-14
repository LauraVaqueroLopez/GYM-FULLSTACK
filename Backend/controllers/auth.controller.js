// controllers/auth.controller.js
import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, dni } = req.body;

  try {
    // Buscar usuario por email
    const user = await Usuario.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Validar DNI (normalizar ambos valores antes de comparar)
    const normalizeDni = (raw) => String(raw || "").trim().replace(/[-\s]/g, "").toUpperCase();
    if (normalizeDni(user.dni) !== normalizeDni(dni))
      return res.status(401).json({ message: "DNI incorrecto" });

    // Crear token JWT
    const token = jwt.sign(
      {
        id: user.id_usuario,
        rol: user.rol,
        nombre: user.nombre,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        rol: user.rol,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
