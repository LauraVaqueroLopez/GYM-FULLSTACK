import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
<<<<<<< HEAD
import contratacionRoutes from "./routes/ContratacionRoutes.js";
import sequelize from "./config/db_connection.js";
import "./models/associations.js";
=======
import seguimientoRoutes from "./routes/seguimiento.routes.js";
>>>>>>> 8c6e238735ad899402d437ff7399cf30678e3e65

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
<<<<<<< HEAD
app.use("/api/contrataciones", contratacionRoutes);
=======
app.use("/api/seguimiento", seguimientoRoutes);
>>>>>>> 8c6e238735ad899402d437ff7399cf30678e3e65

const PORT = process.env.PORT || 4000;

// Sincronizar con la BD (opcional)
sequelize.authenticate()
  .then(() => console.log("✅ Conectado correctamente a la base de datos MySQL"))
  .catch((err) => console.error("❌ Error al conectar con la base de datos:", err));

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
