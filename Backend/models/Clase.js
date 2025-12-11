// models/Clase.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";

const Clase = sequelize.define(
  "Clase",
  {
    id_clase: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nombre_clase: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_entrenador: {
      type: DataTypes.CHAR(36),
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    hora: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    plazas_disponibles: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
  },
  {
    tableName: "Clases",
    timestamps: false,
  }
);

export default Clase;
