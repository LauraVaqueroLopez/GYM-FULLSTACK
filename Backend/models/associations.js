
import Usuario from "./Usuario.js";
import Cliente from "./Cliente.js";
import Entrenador from "./Entrenador.js";
import Contratacion from "./Contratacion.js";
import Resenia from "./Resenia.js";

// Relación Usuario → Cliente y Entrenador
Usuario.hasOne(Cliente, { foreignKey: "id_usuario", onDelete: "CASCADE" });
Cliente.belongsTo(Usuario, { foreignKey: "id_usuario", onDelete: "CASCADE" });

Usuario.hasOne(Entrenador, { foreignKey: "id_usuario", onDelete: "CASCADE" });
Entrenador.belongsTo(Usuario, { foreignKey: "id_usuario", onDelete: "CASCADE" });

// Relación Cliente ↔ Contratación
Cliente.hasMany(Contratacion, { foreignKey: "id_cliente" });
Contratacion.belongsTo(Cliente, { foreignKey: "id_cliente" });

// Relación Entrenador ↔ Contratación
Entrenador.hasMany(Contratacion, { foreignKey: "id_entrenador" });
Contratacion.belongsTo(Entrenador, { foreignKey: "id_entrenador" });

export { Usuario, Cliente, Entrenador, Contratacion };
// Asociaciones para reseñas
Usuario.hasMany(Resenia, { foreignKey: "id_usuario", as: "resenasEscritas" });
Resenia.belongsTo(Usuario, { foreignKey: "id_usuario", as: "autor" });

Usuario.hasMany(Resenia, { foreignKey: "id_entrenador", as: "resenasRecibidas" });
Resenia.belongsTo(Usuario, { foreignKey: "id_entrenador", as: "entrenadorUsuario" });

export { Resenia };
