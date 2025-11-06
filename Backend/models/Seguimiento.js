import { DataTypes } from "sequelize";
import sequelize from "../config/db_connection.js";
import Usuario from "./Usuario.js";

const Seguimiento = sequelize.define(
	"Seguimiento",
	{
		id_seguimiento: { type: DataTypes.CHAR(36), primaryKey: true, defaultValue: DataTypes.UUIDV4 },
		id_usuario: { type: DataTypes.CHAR(36), allowNull: false },
		fecha: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
		peso: { type: DataTypes.DECIMAL(5, 2) },
		altura: { type: DataTypes.DECIMAL(5, 2) },
		calorias_quemadas: { type: DataTypes.FLOAT },
		observaciones: { type: DataTypes.TEXT },
	},
	{ tableName: "Seguimiento", timestamps: false }
);

Seguimiento.belongsTo(Usuario, { foreignKey: "id_usuario", onDelete: "CASCADE" });

export default Seguimiento;
