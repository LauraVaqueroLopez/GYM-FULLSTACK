import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";

const Reserva = sequelize.define(
  "Reserva",
  {
    id_reserva: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    id_cliente: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    id_clase: {
      type: DataTypes.CHAR(36),
      allowNull: false,
    },
    fecha_reserva: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Reservas",
    timestamps: false,
  }
);

export default Reserva;
