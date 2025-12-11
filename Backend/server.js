import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import contratacionRoutes from "./routes/ContratacionRoutes.js";
import seguimientoRoutes from "./routes/seguimiento.routes.js";
import resenasRoutes from "./routes/resenas.routes.js";

import claseRoutes from "./routes/ClaseRoutes.js";
import reservaRoutes from "./routes/ReservaRoutes.js";

// Rutas tienda
import tiendaRoutes from "./routes/tienda.routes.js";

// Rutas productos
import productoRoutes from "./routes/ProductoRoutes.js";

// Rutas carrito
import carritoRoutes from "./routes/CarritoRoutes.js";

// Rutas pedidos
import pedidoRoutes from "./routes/PedidoRoutes.js";

import sequelize from "./config/db_connection.js";
import "./models/associations.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ============================
//           RUTAS
// ============================

// Autenticación
app.use("/api/auth", authRoutes);

// Contrataciones, seguimiento y reseñas
app.use("/api/contrataciones", contratacionRoutes);
app.use("/api/seguimiento", seguimientoRoutes);
app.use("/api/resenas", resenasRoutes);

// Clases y reservas
app.use("/api/clases", claseRoutes);
app.use("/api/reservas", reservaRoutes);

// Tienda + productos
app.use("/api/tienda", tiendaRoutes);
app.use("/api/productos", productoRoutes);

// Carrito
app.use("/api/carrito", carritoRoutes);

// Pedidos
app.use("/api/pedidos", pedidoRoutes);

// ============================
//       INICIAR SERVIDOR
// ============================
const PORT = process.env.PORT || 4000;

sequelize
  .authenticate()
  .then(() => console.log("✅ Conectado correctamente a la base de datos MySQL"))
  .catch((err) =>
    console.error("❌ Error al conectar con la base de datos:", err)
  );

app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
);
