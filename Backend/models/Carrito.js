import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";
import Usuario from "./Usuario.js";
import Producto from "./Producto.js";

const Carrito = sequelize.define(
  "Carrito",
  {
    id_carrito: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    id_usuario: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: "Carrito", // ¡ojo! singular, coincide con la tabla MySQL
    timestamps: false,
  }
);

// Relaciones
Carrito.belongsTo(Usuario, { foreignKey: "id_usuario" });
Carrito.belongsTo(Producto, { foreignKey: "id_producto" });

export default Carrito;
