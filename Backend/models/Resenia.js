import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";

const Resenia = sequelize.define(
  "Resenia",
  {
    id_resenia: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    id_usuario: { type: DataTypes.UUID, allowNull: false }, // autor (cliente)
    id_entrenador: { type: DataTypes.UUID, allowNull: false }, // entrenador (usuario id)
    puntuacion: { type: DataTypes.TINYINT, allowNull: true },
    comentario: { type: DataTypes.TEXT, allowNull: true },
    fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  },
  { tableName: "resenias", timestamps: false }
);

export default Resenia;
