import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  obtenerClasesPorFecha,
  reservarClase,
  obtenerReservasCliente
} from "../controllers/ReservaController.js";

const router = express.Router();

// Obtener clases filtradas por fecha (query ?fecha=YYYY-MM-DD)
router.get("/clases", verifyToken, obtenerClasesPorFecha);

// Reservar una clase
router.post("/", verifyToken, reservarClase);

// Obtener todas las reservas del cliente autenticado
router.get("/", verifyToken, obtenerReservasCliente);

export default router;
