-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-01-2026 a las 14:13:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `gimnasio_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Carrito`
--

CREATE TABLE `Carrito` (
  `id_Carrito` char(36) NOT NULL DEFAULT (UUID()),
  `id_usuario` char(36) NOT NULL,
  `id_producto` char(36) NOT NULL,
  `cantidad` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Carrito`
--

INSERT INTO `Carrito` (`id_Carrito`, `id_usuario`, `id_producto`, `cantidad`) VALUES
('10314028-9fde-4bcb-8bc2-784e82f5bb30', '395d3956-5592-4d39-a77a-4cb5e6aaf0d5', 'ea5218be-d6a3-11f0-8377-2c58b9490181', 1),
('2e32a3c4-f35b-45c4-8d3e-39f27f917f95', '395d3956-5592-4d39-a77a-4cb5e6aaf0d5', 'ea5220e8-d6a3-11f0-8377-2c58b9490181', 1),
('3a43bb08-d83c-4688-befb-e4ae5f4da710', '395d3956-5592-4d39-a77a-4cb5e6aaf0d5', 'ea521d5a-d6a3-11f0-8377-2c58b9490181', 1),
('664ad471-d6a3-11f0-8377-2c58b9490181', '91e1bfba-a205-471a-a15c-da24292dc913', '62e911eb-d6a3-11f0-8377-2c58b9490181', 3),
('ffd86b20-b50e-473b-9d2e-9bd4a57ba9ae', '0789b029-4c63-47fa-8f66-3414f4c96b4b', 'ea5220e8-d6a3-11f0-8377-2c58b9490181', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Clases`
--

CREATE TABLE `Clases` (
  `id_clase` char(36) NOT NULL DEFAULT (UUID()),
  `nombre_clase` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_entrenador` char(36) DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `plazas_disponibles` int(11) DEFAULT 0,
  `hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Clases`
--

INSERT INTO `Clases` (`id_clase`, `nombre_clase`, `descripcion`, `id_entrenador`, `fecha`, `hora`, `plazas_disponibles`, `hora_fin`) VALUES
('d4bab64a-d6a3-11f0-8377-2c58b9490181', 'CrossFit', 'Entrenamiento funcional de alta intensidad', 'cc9010b1-1de8-4791-9ba3-d32ba9d8a1e1', '2025-12-15', '10:00:00', 14, '11:00:00'),
('d4bae5ba-d6a3-11f0-8377-2c58b9490181', 'Yoga', 'Clase de yoga para todos los niveles', '1511e744-41c6-4b43-a6fb-f4f9ab32ec47', '2025-12-16', '18:00:00', 20, '19:00:00'),
('d4bae8f3-d6a3-11f0-8377-2c58b9490181', 'Boxeo', 'Entrenamiento de boxeo para principiantes', 'cc9010b1-1de8-4791-9ba3-d32ba9d8a1e1', '2025-12-17', '12:00:00', 12, '13:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Clientes`
--

CREATE TABLE `Clientes` (
  `id_cliente` char(36) NOT NULL DEFAULT (UUID()),
  `id_usuario` char(36) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `objetivo` enum('perder peso','ganar musculo','mejorar resistencia','otro') DEFAULT NULL,
  `codigo_personal` char(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Clientes`
--

INSERT INTO `Clientes` (`id_cliente`, `id_usuario`, `fecha_nacimiento`, `peso`, `altura`, `objetivo`, `codigo_personal`) VALUES
('1d7d931d-b5d7-4cd0-a24c-407a9cc0bc68', '47e659e7-3d59-4fb8-be61-81dd35b6060b', '0006-06-06', 143.00, 167.00, '', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Contrataciones`
--

CREATE TABLE `Contrataciones` (
  `id_contratacion` char(36) NOT NULL DEFAULT (UUID()),
  `id_cliente` char(36) NOT NULL,
  `id_entrenador` char(36) NOT NULL,
  `fecha_contratacion` date DEFAULT (curdate()),
  `estado` enum('activa','finalizada','cancelada') DEFAULT 'activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Detallepedidos`
--

CREATE TABLE `Detallepedidos` (
  `id_detalle` char(36) NOT NULL DEFAULT (UUID()),
  `id_pedido` char(36) NOT NULL,
  `id_producto` char(36) NOT NULL,
  `cantidad` int(11) NOT NULL CHECK (`cantidad` > 0),
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Entrenadores`
--

CREATE TABLE `Entrenadores` (
  `id_entrenador` char(36) NOT NULL DEFAULT (UUID()),
  `id_usuario` char(36) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `experiencia` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Entrenadores`
--

INSERT INTO `Entrenadores` (`id_entrenador`, `id_usuario`, `especialidad`, `experiencia`, `descripcion`) VALUES
('03710f82-58ee-4fb0-b7df-69516667b695', 'cc9010b1-1de8-4791-9ba3-d32ba9d8a1e1', 'Ganancia muscular', 5, 'sientete vivo'),
('2ddedade-95d5-4c8a-be99-73001dbf7b68', '1511e744-41c6-4b43-a6fb-f4f9ab32ec47', 'Nutricion', 3, 'experimentada'),
('c6c62a44-138b-42f7-b414-71dabdead094', '5edc10db-0728-4cc7-93c3-e31a78fd34ce', 'Ganar masa y pérdida de peso', 3, 'experto en nutricion');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Pedidos`
--

CREATE TABLE `Pedidos` (
  `id_pedido` char(36) NOT NULL DEFAULT (UUID()),
  `id_cliente` char(36) NOT NULL,
  `fecha_pedido` date DEFAULT (curdate()),
  `total` decimal(10,2) DEFAULT 0.00,
  `estado` enum('pendiente','pagado','enviado') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Productos`
--

CREATE TABLE `Productos` (
  `id_producto` char(36) NOT NULL DEFAULT (UUID()),
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `categoria` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Productos`
--

INSERT INTO `Productos` (`id_producto`, `nombre`, `descripcion`, `precio`, `stock`, `categoria`) VALUES
('62e911eb-d6a3-11f0-8377-2c58b9490181', 'Proteína Whey', 'Proteína de suero concentrada', 29.99, 51, 'suplementos'),
('62eb1205-d6a3-11f0-8377-2c58b9490181', 'Mancuernas 10kg', 'Par de mancuernas de 10kg', 45.00, 22, 'equipamiento'),
('ea509ab3-d6a3-11f0-8377-2c58b9490181', 'Proteína Whey Vainilla', 'Proteína de suero con sabor a vainilla', 29.99, 50, 'Suplementos'),
('ea5216c2-d6a3-11f0-8377-2c58b9490181', 'Creatina Monohidratada', 'Creatina micronizada de alta pureza', 19.99, 80, 'Suplementos'),
('ea5218be-d6a3-11f0-8377-2c58b9490181', 'BCAA 2:1:1', 'Aminoácidos esenciales para recuperación muscular', 24.50, 39, 'Suplementos'),
('ea521a12-d6a3-11f0-8377-2c58b9490181', 'Glutamina 500g', 'Glutamina pura para mejorar la recuperación', 18.99, 35, 'Suplementos'),
('ea521c04-d6a3-11f0-8377-2c58b9490181', 'Pre Entreno Xtreme', 'Pre-entreno con cafeína y beta-alanina', 32.00, 25, 'Suplementos'),
('ea521c88-d6a3-11f0-8377-2c58b9490181', 'Mancuernas 5kg', 'Par de mancuernas de 5kg', 22.99, 30, 'Equipamiento'),
('ea521cf9-d6a3-11f0-8377-2c58b9490181', 'Mancuernas 10kg', 'Par de mancuernas de 10kg', 45.00, 20, 'Equipamiento'),
('ea521d5a-d6a3-11f0-8377-2c58b9490181', 'Barra Olímpica 20kg', 'Barra profesional para levantamiento', 120.00, 9, 'Equipamiento'),
('ea521dd7-d6a3-11f0-8377-2c58b9490181', 'Discos 10kg (par)', 'Par de discos de 10kg', 35.00, 40, 'Equipamiento'),
('ea521e2f-d6a3-11f0-8377-2c58b9490181', 'Esterilla de Yoga', 'Esterilla antideslizante de 6mm', 15.99, 60, 'Accesorios'),
('ea521e99-d6a3-11f0-8377-2c58b9490181', 'Guantes de Boxeo 12oz', 'Guantes acolchados para boxeo', 39.99, 25, 'Accesorios'),
('ea521efc-d6a3-11f0-8377-2c58b9490181', 'Comba Profesional', 'Cuerda de saltar ajustable', 12.99, 70, 'Accesorios'),
('ea521f57-d6a3-11f0-8377-2c58b9490181', 'Cinturón de Levantamiento', 'Cinturón rígido para powerlifting', 29.99, 15, 'Accesorios'),
('ea522005-d6a3-11f0-8377-2c58b9490181', 'Rodilleras Deportivas', 'Rodilleras elásticas para entrenamiento', 17.99, 50, 'Accesorios'),
('ea52208c-d6a3-11f0-8377-2c58b9490181', 'Guantes de Entrenamiento', 'Guantes acolchados para gimnasio', 14.99, 45, 'Accesorios'),
('ea5220e8-d6a3-11f0-8377-2c58b9490181', 'Bidón 2 Litros', 'Botella deportiva resistente', 9.99, 98, 'Accesorios'),
('ea522160-d6a3-11f0-8377-2c58b9490181', 'Toalla Microfibra', 'Toalla absorbente de secado rápido', 7.50, 120, 'Accesorios'),
('ea5221ec-d6a3-11f0-8377-2c58b9490181', 'Sudadera Deportiva', 'Sudadera transpirable para entrenamiento', 29.99, 30, 'Ropa'),
('ea522258-d6a3-11f0-8377-2c58b9490181', 'Camiseta Dry-Fit', 'Camiseta ligera y transpirable', 12.99, 80, 'Ropa'),
('ea5222ba-d6a3-11f0-8377-2c58b9490181', 'Pantalón Deportivo', 'Pantalón cómodo para gym y running', 19.99, 50, 'Ropa');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Resenias`
--

CREATE TABLE `Resenias` (
  `id_resenia` char(36) NOT NULL DEFAULT (UUID()),
  `id_usuario` char(36) NOT NULL,
  `id_entrenador` char(36) NOT NULL,
  `puntuacion` tinyint(4) DEFAULT NULL CHECK (`puntuacion` between 1 and 5),
  `comentario` text DEFAULT NULL,
  `fecha` date DEFAULT (curdate())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Resenias`
--

INSERT INTO `Resenias` (`id_resenia`, `id_usuario`, `id_entrenador`, `puntuacion`, `comentario`, `fecha`) VALUES
('02b8608e-f7b4-49f3-be9f-d883b360937e', '91e1bfba-a205-471a-a15c-da24292dc913', 'cc9010b1-1de8-4791-9ba3-d32ba9d8a1e1', 5, 'asdasd', '2025-11-30'),
('1b64ea50-ec51-4081-af11-0822e1bf86a4', '0789b029-4c63-47fa-8f66-3414f4c96b4b', '1511e744-41c6-4b43-a6fb-f4f9ab32ec47', 5, 'me ayudó en press banca (no sé lo que significa)', '2025-12-02'),
('6d293589-728c-4f7f-8739-2fbe319dec56', '395d3956-5592-4d39-a77a-4cb5e6aaf0d5', 'cc9010b1-1de8-4791-9ba3-d32ba9d8a1e1', 5, 'sdfsfdf', '2025-11-30'),
('8ad43dd9-dd89-494c-a596-ffb57ba6a56b', '395d3956-5592-4d39-a77a-4cb5e6aaf0d5', '1511e744-41c6-4b43-a6fb-f4f9ab32ec47', 5, 'sfsfdfsfdf', '2025-11-30'),
('e0cd3b89-8c7e-453c-a011-2b169ee442fe', '91e1bfba-a205-471a-a15c-da24292dc913', '1511e744-41c6-4b43-a6fb-f4f9ab32ec47', 5, 'aasd', '2025-11-30');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Reservas`
--

CREATE TABLE `Reservas` (
  `id_reserva` char(36) NOT NULL DEFAULT (UUID()),
  `id_cliente` char(36) NOT NULL,
  `id_clase` char(36) NOT NULL,
  `fecha_reserva` date DEFAULT (curdate())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Seguimiento`
--

CREATE TABLE `Seguimiento` (
  `id_Seguimiento` char(36) NOT NULL DEFAULT (UUID()),
  `id_usuario` char(36) NOT NULL,
  `fecha` date DEFAULT (curdate()),
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `calorias_quemadas` float DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Seguimiento`
--

INSERT INTO `Seguimiento` (`id_Seguimiento`, `id_usuario`, `fecha`, `peso`, `altura`, `calorias_quemadas`, `observaciones`) VALUES
('2804b95d-f911-4858-86e2-f67851c723ed', '91e1bfba-a205-471a-a15c-da24292dc913', '2025-11-30', 234.00, 136.00, 123, '1231321'),
('d413db98-a205-4e1f-8e2f-e9fb3a749df4', '0789b029-4c63-47fa-8f66-3414f4c96b4b', '2025-12-02', 45.00, 150.00, 120, 'estoy felis'),
('f2c627c9-fa60-4ad4-bb6e-ea5538e03a53', '91e1bfba-a205-471a-a15c-da24292dc913', '2025-11-30', 130.00, 130.00, 123, 'sefssesf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Usuarios`
--

CREATE TABLE `Usuarios` (
  `id_usuario` char(36) NOT NULL DEFAULT (UUID()),
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `rol` enum('cliente','entrenador','admin') NOT NULL,
  `fecha_registro` date DEFAULT (curdate())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `Usuarios`
--

INSERT INTO `Usuarios` (`id_usuario`, `nombre`, `apellidos`, `email`, `dni`, `rol`, `fecha_registro`) VALUES
('0789b029-4c63-47fa-8f66-3414f4c96b4b', 'panceta', 'martinez vaquero', 'panceta.mv@gmail.com', '48160603Y', 'cliente', '2025-12-02'),
('1511e744-41c6-4b43-a6fb-f4f9ab32ec47', 'Alicia', 'Pedraza', 'ali@gmail.com', '111111111L', 'entrenador', '2025-11-30'),
('395d3956-5592-4d39-a77a-4cb5e6aaf0d5', 'Alicia', 'Pedraza', 'lo@gmail.com', '444444444L', 'cliente', '2025-11-30'),
('47e659e7-3d59-4fb8-be61-81dd35b6060b', 'Laura', 'Vaquero', 'lara@gmail.com', '111111111N', 'cliente', '2026-01-01'),
('5edc10db-0728-4cc7-93c3-e31a78fd34ce', 'Laura', 'Vaquero', 'la@gmail.com', '000000000N', 'entrenador', '2026-01-01'),
('69b86b16-1b54-4dc2-8a68-d65c7d022a68', 'Alicia', 'Pedraza', 'lolos@gmail.com', '222222222L', 'cliente', '2026-01-01'),
('73f12706-0b14-4bce-bfa3-0a0e4b9a5628', 'Alicia', 'Pedraza', 'lop@gmail.com', '999999999N', 'cliente', '2026-01-01'),
('81de52ba-33a2-4892-ab4e-9c01c98e5250', 'Laura', 'Vaquero', 'lap@gmail.com', '888888888N', 'cliente', '2026-01-01'),
('91e1bfba-a205-471a-a15c-da24292dc913', 'judi', 'caba', 'judi@gmail.com', '333333333L', 'cliente', '2025-11-30'),
('b658a5ef-0c58-4265-b62b-6482232dfe3a', 'Alicia', 'Pedraza', 'lala@gmail.com', '222222223L', 'cliente', '2026-01-01'),
('cc9010b1-1de8-4791-9ba3-d32ba9d8a1e1', 'Laura', 'Vaquero', 'lau@gmail.com', '2222222222L', 'entrenador', '2025-11-30');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `Carrito`
--
ALTER TABLE `Carrito`
  ADD PRIMARY KEY (`id_Carrito`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `Clases`
--
ALTER TABLE `Clases`
  ADD PRIMARY KEY (`id_clase`),
  ADD KEY `id_entrenador` (`id_entrenador`);

--
-- Indices de la tabla `Clientes`
--
ALTER TABLE `Clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`),
  ADD UNIQUE KEY `uniq_codigo_personal` (`codigo_personal`);

--
-- Indices de la tabla `Contrataciones`
--
ALTER TABLE `Contrataciones`
  ADD PRIMARY KEY (`id_contratacion`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_entrenador` (`id_entrenador`);

--
-- Indices de la tabla `Detallepedidos`
--
ALTER TABLE `Detallepedidos`
  ADD PRIMARY KEY (`id_detalle`),
  ADD UNIQUE KEY `id_pedido` (`id_pedido`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `Entrenadores`
--
ALTER TABLE `Entrenadores`
  ADD PRIMARY KEY (`id_entrenador`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `Pedidos`
--
ALTER TABLE `Pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `Productos`
--
ALTER TABLE `Productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `Resenias`
--
ALTER TABLE `Resenias`
  ADD PRIMARY KEY (`id_resenia`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_entrenador` (`id_entrenador`);

--
-- Indices de la tabla `Reservas`
--
ALTER TABLE `Reservas`
  ADD PRIMARY KEY (`id_reserva`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_clase` (`id_clase`);

--
-- Indices de la tabla `Seguimiento`
--
ALTER TABLE `Seguimiento`
  ADD PRIMARY KEY (`id_Seguimiento`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `Usuarios`
--
ALTER TABLE `Usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `Carrito`
--
ALTER TABLE `Carrito`
  ADD CONSTRAINT `Carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Carrito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `Productos` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `Clases`
--
ALTER TABLE `Clases`
  ADD CONSTRAINT `Clases_ibfk_1` FOREIGN KEY (`id_entrenador`) REFERENCES `Usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `Clientes`
--
ALTER TABLE `Clientes`
  ADD CONSTRAINT `Clientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `Contrataciones`
--
ALTER TABLE `Contrataciones`
  ADD CONSTRAINT `Contrataciones_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `Clientes` (`id_cliente`) ON DELETE CASCADE,
  ADD CONSTRAINT `Contrataciones_ibfk_2` FOREIGN KEY (`id_entrenador`) REFERENCES `Entrenadores` (`id_entrenador`) ON DELETE CASCADE;

--
-- Filtros para la tabla `Detallepedidos`
--
ALTER TABLE `Detallepedidos`
  ADD CONSTRAINT `Detallepedidos_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `Pedidos` (`id_pedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `Detallepedidos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `Productos` (`id_producto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `Entrenadores`
--
ALTER TABLE `Entrenadores`
  ADD CONSTRAINT `Entrenadores_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `Pedidos`
--
ALTER TABLE `Pedidos`
  ADD CONSTRAINT `Pedidos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `Clientes` (`id_cliente`) ON DELETE CASCADE;

--
-- Filtros para la tabla `Resenias`
--
ALTER TABLE `Resenias`
  ADD CONSTRAINT `Resenias_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `Resenias_ibfk_2` FOREIGN KEY (`id_entrenador`) REFERENCES `Usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `Reservas`
--
ALTER TABLE `Reservas`
  ADD CONSTRAINT `Reservas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `Clientes` (`id_cliente`) ON DELETE CASCADE,
  ADD CONSTRAINT `Reservas_ibfk_2` FOREIGN KEY (`id_clase`) REFERENCES `Clases` (`id_clase`) ON DELETE CASCADE;

--
-- Filtros para la tabla `Seguimiento`
--
ALTER TABLE `Seguimiento`
  ADD CONSTRAINT `Seguimiento_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `Usuarios` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
