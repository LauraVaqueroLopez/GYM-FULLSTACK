import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";
import Usuario from "./Usuario.js";

const Cliente = sequelize.define(
  "Cliente",
  {
    id_cliente: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    id_usuario: { type: DataTypes.CHAR(36), allowNull: false, unique: true },
    fecha_nacimiento: DataTypes.DATEONLY,
  peso: DataTypes.DECIMAL(5, 2),
  altura: DataTypes.DECIMAL(5, 2),
    objetivo: DataTypes.ENUM("perder peso","ganar músculo","mejorar resistencia","otro")
  },
  { tableName: "Clientes", timestamps: false }
);

Cliente.belongsTo(Usuario, { foreignKey: "id_usuario", onDelete: "CASCADE" });

export default Cliente;
