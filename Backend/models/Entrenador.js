// models/Entrenador.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";
import Usuario from "./Usuario.js";

const Entrenador = sequelize.define(
  "Entrenador",
  {
    id_entrenador: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    id_usuario: {
      type: DataTypes.CHAR(36),
      allowNull: false,
      unique: true,
    },
    especialidad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    experiencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "Entrenadores",
    timestamps: false,
  }
);

// Relación: Un Usuario puede ser un Entrenador
Usuario.hasOne(Entrenador, { foreignKey: "id_usuario", as: "entrenador" });
Entrenador.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

export default Entrenador;
