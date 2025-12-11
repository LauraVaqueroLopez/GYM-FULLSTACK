import express from "express";
import {
  obtenerCarrito,
  agregarProductoCarrito,
  eliminarProductoCarrito,
  eliminarUnidadProducto,
} from "../controllers/CarritoController.js";

import { realizarPedido } from "../controllers/PedidoController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, obtenerCarrito);
router.post("/", verifyToken, agregarProductoCarrito);
router.delete("/:id_producto", verifyToken, eliminarProductoCarrito);
router.patch("/eliminar-unidad/:id_producto", verifyToken, eliminarUnidadProducto);

router.post("/realizar-pedido", verifyToken, realizarPedido);

export default router;
