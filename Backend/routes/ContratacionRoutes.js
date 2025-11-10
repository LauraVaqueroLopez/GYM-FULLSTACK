import express from "express";
import {
  contratarEntrenador,
  obtenerContratacionesCliente,
  cancelarContratacion,
  getEntrenadores,
} from "../controllers/ContratacionController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/entrenadores", getEntrenadores); 
router.post("/contratar", verifyToken, contratarEntrenador);
router.get("/mis-contrataciones", verifyToken, obtenerContratacionesCliente);
router.put("/cancelar/:id", verifyToken, cancelarContratacion);

export default router;
