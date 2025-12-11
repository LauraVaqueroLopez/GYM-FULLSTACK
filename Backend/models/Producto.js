// models/Producto.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";

const Producto = sequelize.define(
  "Producto",
  {
    id_producto: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "Productos",
    timestamps: false,
  }
);

export default Producto;
