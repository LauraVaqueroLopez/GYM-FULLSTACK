import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";
import Cliente from "./Cliente.js";

const Pedido = sequelize.define(
  "Pedido",
  {
    id_pedido: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    id_cliente: {
      type: DataTypes.CHAR(36), // ✅ corregido, antes era INTEGER
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    fecha_pedido: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "pagado", "enviado"),
      defaultValue: "pendiente",
    },
  },
  {
    tableName: "Pedidos",
    timestamps: false,
  }
);

Cliente.hasMany(Pedido, { foreignKey: "id_cliente" });
Pedido.belongsTo(Cliente, { foreignKey: "id_cliente" });

export default Pedido;
