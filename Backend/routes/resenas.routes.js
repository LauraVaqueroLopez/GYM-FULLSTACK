import express from "express";
import { getResenasPorEntrenador, crearResenia } from "../controllers/ReseniaController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Obtener reseñas de un entrenador 
router.get("/entrenador/:id", getResenasPorEntrenador);

// Crear reseña (solo clientes)
router.post("/", verifyToken, crearResenia);

export default router;
