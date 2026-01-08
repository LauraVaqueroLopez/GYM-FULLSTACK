import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Falta el token de autorización" });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id_usuario: decoded.id_usuario,
      rol: decoded.rol,
      nombre: decoded.nombre,
      id_cliente: decoded.id_cliente || null,
      id_entrenador: decoded.id_entrenador || null,
    };

    next();
  } catch (err) {
    console.error("Token inválido o expirado:", err);
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
