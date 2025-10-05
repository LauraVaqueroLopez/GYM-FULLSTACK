import express from "express";
import sequelize from "./db/connection.js"; // Importa la conexión
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Ejemplo de ruta
app.get("/", (req, res) => {
  res.send("Servidor funcionando 🚀");
});

const PORT = process.env.PORT || 3000;

// Sincronizamos la base de datos y luego levantamos el server
(async () => {
  try {
    await sequelize.sync(); // crea las tablas si no existen
    console.log("✅ Base de datos sincronizada");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
})();
