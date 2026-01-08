// routes/tienda.routes.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  obtenerProductos,
  crearPedido,
  obtenerPedidosCliente
} from "../controllers/TiendaController.js";

const router = express.Router();

router.use(verifyToken);

router.get("/productos", obtenerProductos);
router.post("/pedidos", crearPedido);
router.get("/pedidos", obtenerPedidosCliente);

export default router;
