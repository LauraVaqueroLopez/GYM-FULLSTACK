-- Crear un usuario
CREATE USER gimnasio_user WITH PASSWORD 'tu_contraseña_segura';

-- Crear la base de datos
CREATE DATABASE gimnasio_db
    OWNER gimnasio_user
    ENCODING 'UTF8'
    LC_COLLATE='en_US.UTF-8'
    LC_CTYPE='en_US.UTF-8'
    TEMPLATE template0;

-- Conceder privilegios
GRANT ALL PRIVILEGES ON DATABASE gimnasio_db TO gimnasio_user;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TABLE Usuarios (
    id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL CHECK (dni ~ '^[0-9]{8}[A-Za-z]$')
    rol VARCHAR(20) CHECK (rol IN ('cliente','entrenador','admin')) NOT NULL,
    fecha_registro DATE DEFAULT CURRENT_DATE
);

CREATE TABLE Clientes (
    id_cliente UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID UNIQUE NOT NULL,
    fecha_nacimiento DATE,
    peso DECIMAL(5,2),
    altura DECIMAL(4,2),
    objetivo VARCHAR(50) CHECK (objetivo IN ('perder peso','ganar músculo','mejorar resistencia','otro')),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE Entrenadores (
    id_entrenador UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID UNIQUE NOT NULL,
    especialidad VARCHAR(100),
    experiencia INT,
    descripcion TEXT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE Clases (
    id_clase UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_clase VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_entrenador UUID,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    plazas_disponibles INT DEFAULT 0,
    FOREIGN KEY (id_entrenador) REFERENCES Usuarios(id_usuario) ON DELETE SET NULL
);

CREATE TABLE Reservas (
    id_reserva UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,
    id_clase UUID NOT NULL,
    fecha_reserva DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_clase) REFERENCES Clases(id_clase) ON DELETE CASCADE
);

CREATE TABLE Seguimiento (
    id_seguimiento UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    peso DECIMAL(5,2),
    altura DECIMAL(4,2),
    calorias_quemadas FLOAT,
    observaciones TEXT,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE Reseñas (
    id_reseña UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,          -- cliente que deja la reseña
    id_entrenador UUID NOT NULL,       -- entrenador reseñado
    puntuacion SMALLINT CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_entrenador) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE,

);

CREATE TABLE Productos (
    id_producto UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    categoria VARCHAR(50)
);

CREATE TABLE Pedidos (
    id_pedido UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_usuario UUID NOT NULL,
    fecha_pedido DATE DEFAULT CURRENT_DATE,
    total DECIMAL(10,2),
    estado VARCHAR(20) CHECK (estado IN ('pendiente','pagado','enviado')) DEFAULT 'pendiente',
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE DetallePedidos (
    id_detalle UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_pedido UUID NOT NULL,
    id_producto UUID NOT NULL,
    cantidad INT DEFAULT 1,
    subtotal DECIMAL(10,2),
    FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto) ON DELETE CASCADE
);
