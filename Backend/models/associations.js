import Usuario from "./Usuario.js";
import Cliente from "./Cliente.js";
import Entrenador from "./Entrenador.js";
import Contratacion from "./Contratacion.js";
import Clase from "./Clase.js";
import Reserva from "./Reserva.js";
import Producto from "./Producto.js";
import Carrito from "./Carrito.js";
import Pedido from "./Pedido.js";
import DetallePedido from "./DetallePedido.js";
import Resenia from "./Resenia.js";

// ----------------------------
// Usuario ↔ Cliente / Entrenador
// ----------------------------
Usuario.hasOne(Cliente, { foreignKey: "id_usuario", onDelete: "CASCADE" });
Cliente.belongsTo(Usuario, { foreignKey: "id_usuario", onDelete: "CASCADE" });

Usuario.hasOne(Entrenador, { foreignKey: "id_usuario", onDelete: "CASCADE" });
Entrenador.belongsTo(Usuario, { foreignKey: "id_usuario", onDelete: "CASCADE" });

// ----------------------------
// Cliente ↔ Contratacion
// ----------------------------
Cliente.hasMany(Contratacion, { foreignKey: "id_cliente" });
Contratacion.belongsTo(Cliente, { foreignKey: "id_cliente" });

// ----------------------------
// Entrenador ↔ Contratacion
// ----------------------------
Entrenador.hasMany(Contratacion, { foreignKey: "id_entrenador" });
Contratacion.belongsTo(Entrenador, { foreignKey: "id_entrenador" });

// ----------------------------
// Clase ↔ Reserva
// ----------------------------
Clase.hasMany(Reserva, { foreignKey: "id_clase", onDelete: "CASCADE" });
Reserva.belongsTo(Clase, { foreignKey: "id_clase", onDelete: "CASCADE" });

// ----------------------------
// Cliente ↔ Reserva
// ----------------------------
Cliente.hasMany(Reserva, { foreignKey: "id_cliente", onDelete: "CASCADE" });
Reserva.belongsTo(Cliente, { foreignKey: "id_cliente", onDelete: "CASCADE" });

// ----------------------------
// Usuario ↔ Carrito
// ----------------------------
Usuario.hasMany(Carrito, { foreignKey: "id_usuario", onDelete: "CASCADE" });
Carrito.belongsTo(Usuario, { foreignKey: "id_usuario", onDelete: "CASCADE" });

// ----------------------------
// Usuario ↔ Resenia (autor)
// ----------------------------
// Una reseña pertenece a un usuario (autor) y se puede incluir con el alias 'autor'
Resenia.belongsTo(Usuario, { foreignKey: "id_usuario", as: "autor" });
Usuario.hasMany(Resenia, { foreignKey: "id_usuario" });

// ----------------------------
// Producto ↔ Carrito (con alias)
// ----------------------------
Producto.hasMany(Carrito, { foreignKey: "id_producto", onDelete: "CASCADE" });
Carrito.belongsTo(Producto, { foreignKey: "id_producto", as: "producto" }); // <- alias obligatorio

// ----------------------------
// Cliente ↔ Pedido
// ----------------------------
Cliente.hasMany(Pedido, { foreignKey: "id_cliente", onDelete: "CASCADE" });
Pedido.belongsTo(Cliente, { foreignKey: "id_cliente", onDelete: "CASCADE" });

// ----------------------------
// Pedido ↔ DetallePedido
// ----------------------------
Pedido.hasMany(DetallePedido, { foreignKey: "id_pedido", onDelete: "CASCADE" });
DetallePedido.belongsTo(Pedido, { foreignKey: "id_pedido", onDelete: "CASCADE" });

// ----------------------------
// Producto ↔ DetallePedido
// ----------------------------
Producto.hasMany(DetallePedido, { foreignKey: "id_producto", onDelete: "CASCADE" });
DetallePedido.belongsTo(Producto, { foreignKey: "id_producto", onDelete: "CASCADE" });

export {
  Usuario,
  Cliente,
  Entrenador,
  Contratacion,
  Clase,
  Reserva,
  Producto,
  Carrito,
  Pedido,
  DetallePedido
};
