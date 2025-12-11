import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";
import Pedido from "./Pedido.js";
import Producto from "./Producto.js";

const DetallePedido = sequelize.define(
  "DetallePedido",
  {
    id_detalle: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    id_pedido: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "DetallePedidos", 
    timestamps: false,
  }
);

// Relaciones
Pedido.hasMany(DetallePedido, { foreignKey: "id_pedido" });
DetallePedido.belongsTo(Pedido, { foreignKey: "id_pedido" });

Producto.hasMany(DetallePedido, { foreignKey: "id_producto" });
DetallePedido.belongsTo(Producto, { foreignKey: "id_producto" });

export default DetallePedido;
