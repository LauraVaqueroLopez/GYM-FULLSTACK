import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";

const Cliente = sequelize.define(
  "Cliente",
  {
    id_cliente: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    id_usuario: { 
      type: DataTypes.CHAR(36), 
      allowNull: false, 
      unique: true 
    },

    codigo_personal: {
      type: DataTypes.STRING(6),
      allowNull: true,
      unique: true,
    },

    fecha_nacimiento: DataTypes.DATEONLY,
    peso: DataTypes.DECIMAL(5, 2),
    altura: DataTypes.DECIMAL(4, 2),

    objetivo: DataTypes.ENUM(
      "perder peso",
      "ganar músculo",
      "mejorar resistencia",
      "otro"
    ),
  },
  { 
    tableName: "Clientes", 
    timestamps: false 
  }
);

export default Cliente;
