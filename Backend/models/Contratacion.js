import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";

const Contratacion = sequelize.define(
  "Contratacion",
  {
    id_contratacion: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    id_cliente: { type: DataTypes.UUID, allowNull: false },
    id_entrenador: { type: DataTypes.UUID, allowNull: false },
    fecha_contratacion: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM("activa", "finalizada", "cancelada"),
      defaultValue: "activa",
    },
  },
  { tableName: "Contrataciones", timestamps: false }
);

export default Contratacion;
