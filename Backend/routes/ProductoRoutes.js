// routes/ProductoRoutes.js
import express from "express";
import { obtenerProductos, crearProducto } from "../controllers/ProductoController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, obtenerProductos);
router.post("/", verifyToken, crearProducto); 

export default router;
