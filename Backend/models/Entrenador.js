import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";
import Usuario from "./Usuario.js";

const Entrenador = sequelize.define(
  "Entrenador",
  {
    id_entrenador: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    id_usuario: { type: DataTypes.CHAR(36), allowNull: false, unique: true },
    especialidad: DataTypes.STRING(100),
    experiencia: DataTypes.INTEGER,
    descripcion: DataTypes.TEXT
  },
  { tableName: "Entrenadores", timestamps: false }
);

Entrenador.belongsTo(Usuario, { foreignKey: "id_usuario", onDelete: "CASCADE" });

export default Entrenador;
