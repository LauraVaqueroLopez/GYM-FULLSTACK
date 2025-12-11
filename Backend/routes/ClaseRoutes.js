import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

import {
  crearClasesTodoAno,
  obtenerClasesEntrenador,
  obtenerDiasDisponibles,
  obtenerHorasDisponibles
} from "../controllers/ClaseController.js";

const router = express.Router();

// Obtener horas disponibles en un día
router.get("/:id_entrenador/dias/:fecha", obtenerHorasDisponibles);

// Obtener días donde el entrenador tiene clases
router.get("/:id_entrenador/dias", obtenerDiasDisponibles);

// Obtener todas las clases de un entrenador
router.get("/:id_entrenador", obtenerClasesEntrenador);

// Crear clases recurrentes para todo el año (solo entrenador)
router.post("/crear-todo-ano", verifyToken, crearClasesTodoAno);

export default router;
