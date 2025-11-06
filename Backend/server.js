import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import contratacionRoutes from "./routes/ContratacionRoutes.js";
import seguimientoRoutes from "./routes/seguimiento.routes.js";

import sequelize from "./config/db_connection.js";
import "./models/associations.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/contrataciones", contratacionRoutes);
app.use("/api/seguimiento", seguimientoRoutes);

const PORT = process.env.PORT || 4000;

// Probar conexión con la BD
sequelize.authenticate()
  .then(() => console.log("✅ Conectado correctamente a la base de datos MySQL"))
  .catch((err) => console.error("❌ Error al conectar con la base de datos:", err));

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
