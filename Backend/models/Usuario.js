import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";

const Usuario = sequelize.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellidos: { type: DataTypes.STRING(100) },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    dni: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    rol: { type: DataTypes.ENUM("cliente", "entrenador", "admin"), allowNull: false },
    fecha_registro: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  },
  { tableName: "Usuarios", timestamps: false }
);

export default Usuario;
