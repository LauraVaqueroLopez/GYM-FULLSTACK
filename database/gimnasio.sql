-- ============================================
-- Base de datos y uso
-- ============================================
CREATE DATABASE IF NOT EXISTS gimnasio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gimnasio_db;

-- ============================================
-- Tabla Usuarios
-- ============================================
CREATE TABLE Usuarios (
    id_usuario CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    rol ENUM('cliente','entrenador','admin') NOT NULL,
    fecha_registro DATE DEFAULT CURRENT_DATE
);

-- ============================================
-- Tabla Clientes
-- ============================================
CREATE TABLE Clientes (
    id_cliente CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    id_usuario CHAR(36) UNIQUE NOT NULL,
    fecha_nacimiento DATE,
    peso DECIMAL(5,2),
    altura DECIMAL(4,2),
    objetivo ENUM('perder peso','ganar músculo','mejorar resistencia','otro'),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- ============================================
-- Tabla Entrenadores
-- ============================================
CREATE TABLE Entrenadores (
    id_entrenador CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    id_usuario CHAR(36) UNIQUE NOT NULL,
    especialidad VARCHAR(100),
    experiencia INT,
    descripcion TEXT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- ============================================
-- Tabla Clases
-- ============================================
CREATE TABLE Clases (
    id_clase CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre_clase VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_entrenador CHAR(36),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    plazas_disponibles INT DEFAULT 0,
    FOREIGN KEY (id_entrenador) REFERENCES Usuarios(id_usuario) ON DELETE SET NULL
);

-- ============================================
-- Tabla Reservas
-- ============================================
CREATE TABLE Reservas (
    id_reserva CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    id_cliente CHAR(36) NOT NULL,
    id_clase CHAR(36) NOT NULL,
    fecha_reserva DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_clase) REFERENCES Clases(id_clase) ON DELETE CASCADE
);

-- ============================================
-- Tabla Seguimiento
-- ============================================
CREATE TABLE Seguimiento (
    id_seguimiento CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    id_usuario CHAR(36) NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    peso DECIMAL(5,2),
    altura DECIMAL(4,2),
    calorias_quemadas FLOAT,
    observaciones TEXT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- ============================================
-- Tabla Reseñas
-- ============================================
CREATE TABLE Resenias (
    id_resenia CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    id_usuario CHAR(36) NOT NULL,
    id_entrenador CHAR(36) NOT NULL,
    puntuacion TINYINT CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_entrenador) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

-- ============================================
-- Tabla Productos
-- ============================================
CREATE TABLE Productos (
    id_producto CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    categoria VARCHAR(50)
);

-- ============================================
-- Tabla Pedidos
-- ============================================
CREATE TABLE Pedidos (
    id_pedido CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    id_cliente CHAR(36) NOT NULL,
    fecha_pedido DATE DEFAULT CURRENT_DATE,
    total DECIMAL(10,2) DEFAULT 0,
    estado ENUM('pendiente','pagado','enviado') DEFAULT 'pendiente',
    FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente) ON DELETE CASCADE
);

-- ============================================
-- Tabla DetallePedidos
-- ============================================
CREATE TABLE DetallePedidos (
    id_detalle CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    id_pedido CHAR(36) NOT NULL,
    id_producto CHAR(36) NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    subtotal DECIMAL(10,2) NOT NULL,
    UNIQUE KEY (id_pedido, id_producto),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);
