// routes/PedidoRoutes.js
import express from "express";
import { realizarPedido } from "../controllers/PedidoController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/realizar", verifyToken, realizarPedido);

export default router;
