-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-11-2025 a las 13:17:47
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
-- Estructura de tabla para la tabla `clases`
--

CREATE TABLE `clases` (
  `id_clase` char(36) NOT NULL DEFAULT uuid(),
  `nombre_clase` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `id_entrenador` char(36) DEFAULT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `plazas_disponibles` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` char(36) NOT NULL DEFAULT uuid(),
  `id_usuario` char(36) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `objetivo` enum('perder peso','ganar m?sculo','mejorar resistencia','otro') DEFAULT NULL
) ;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `id_usuario`, `fecha_nacimiento`, `peso`, `altura`, `objetivo`) VALUES
('7f859eab-1cfe-41fc-8608-bf6c9c94e90f', '577cd994-65ad-4988-a3a6-5abb4aeb6606', '2000-04-01', 45.00, 123.00, 'perder peso'),
('a3e7677d-a04b-4558-8cb0-753791ea9850', '36c90cd0-a676-42e0-a36f-90b37c1c66b4', '2000-06-02', 183.50, 178.00, 'perder peso'),
('e20d0a4d-4331-4f50-a50e-678bb4cb74d5', 'fa1c3e6c-c44b-4c55-ade2-c745f48a1ba7', '2005-01-17', 56.00, 156.00, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `contrataciones`
--

CREATE TABLE `contrataciones` (
  `id_contratacion` char(36) NOT NULL DEFAULT uuid(),
  `id_cliente` char(36) NOT NULL,
  `id_entrenador` char(36) NOT NULL,
  `fecha_contratacion` date DEFAULT curdate(),
  `estado` enum('activa','finalizada','cancelada') DEFAULT 'activa'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallepedidos`
--

CREATE TABLE `detallepedidos` (
  `id_detalle` char(36) NOT NULL DEFAULT uuid(),
  `id_pedido` char(36) NOT NULL,
  `id_producto` char(36) NOT NULL,
  `cantidad` int(11) NOT NULL CHECK (`cantidad` > 0),
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entrenadores`
--

CREATE TABLE `entrenadores` (
  `id_entrenador` char(36) NOT NULL DEFAULT uuid(),
  `id_usuario` char(36) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `experiencia` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `entrenadores`
--

INSERT INTO `entrenadores` (`id_entrenador`, `id_usuario`, `especialidad`, `experiencia`, `descripcion`) VALUES
('58a059d5-1cd2-4014-b8be-d4e66520ac15', 'c942d0df-42a0-4339-ac2d-8a04ff276524', 'tONIFICACIÓN Y PÉRDIDA DE PESO', 5, 'eNTRENADORA EXPERIMENTADA'),
('8a855d0a-7357-45ca-bed4-3d1a30bd3e57', '58fc6059-ae5b-413a-8992-94dde5a67ade', 'Ganar masa muscular', 4, 'Gran apasionado del deporte que busca ayudar a los demás a conseguir sus objetivos.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` char(36) NOT NULL DEFAULT uuid(),
  `id_cliente` char(36) NOT NULL,
  `fecha_pedido` date DEFAULT curdate(),
  `total` decimal(10,2) DEFAULT 0.00,
  `estado` enum('pendiente','pagado','enviado') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` char(36) NOT NULL DEFAULT uuid(),
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `categoria` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resenias`
--

CREATE TABLE `resenias` (
  `id_resenia` char(36) NOT NULL DEFAULT uuid(),
  `id_usuario` char(36) NOT NULL,
  `id_entrenador` char(36) NOT NULL,
  `id_contratacion` char(36) DEFAULT NULL,
  `puntuacion` tinyint(4) DEFAULT NULL CHECK (`puntuacion` between 1 and 5),
  `comentario` text DEFAULT NULL,
  `fecha` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id_reserva` char(36) NOT NULL DEFAULT uuid(),
  `id_cliente` char(36) NOT NULL,
  `id_clase` char(36) NOT NULL,
  `fecha_reserva` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seguimiento`
--

CREATE TABLE `seguimiento` (
  `id_seguimiento` char(36) NOT NULL DEFAULT uuid(),
  `id_usuario` char(36) NOT NULL,
  `fecha` date DEFAULT curdate(),
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `calorias_quemadas` float DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `seguimiento`
--

INSERT INTO `seguimiento` (`id_seguimiento`, `id_usuario`, `fecha`, `peso`, `altura`, `calorias_quemadas`, `observaciones`) VALUES
('06e501d2-9540-4f12-83b8-170cf8755614', 'fa1c3e6c-c44b-4c55-ade2-c745f48a1ba7', '2025-10-17', 88.00, 99.99, 400, 'nada'),
('0a97bea3-7fe3-4ae6-a526-20cbaecc4a03', '577cd994-65ad-4988-a3a6-5abb4aeb6606', '2025-10-17', 34.00, 234.00, 123, NULL),
('1b092b56-5c82-4de7-b90b-3dd1cc6ae74f', '577cd994-65ad-4988-a3a6-5abb4aeb6606', '2025-10-17', 234.00, 234.00, 234, NULL),
('1f3d7a30-7480-4a78-a09f-5f10ff225481', 'fa1c3e6c-c44b-4c55-ade2-c745f48a1ba7', '2025-10-17', 234.00, 99.99, 34, NULL),
('8b9b4753-d92e-4596-9eb6-5af86c78a98b', 'fa1c3e6c-c44b-4c55-ade2-c745f48a1ba7', '2025-10-17', 45.00, 123.00, 3234, 'fsff'),
('969acaf2-cab8-4197-a804-749f288409f9', 'fa1c3e6c-c44b-4c55-ade2-c745f48a1ba7', '2025-10-17', 56.00, 99.99, 2343, 'eee'),
('c2808a3a-51a2-4f92-a06b-0a42d53605bd', '577cd994-65ad-4988-a3a6-5abb4aeb6606', '0002-10-17', 234.00, 234.00, 234, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` char(36) NOT NULL DEFAULT uuid(),
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `rol` enum('cliente','entrenador','admin') NOT NULL,
  `fecha_registro` date DEFAULT curdate()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `apellidos`, `email`, `dni`, `rol`, `fecha_registro`) VALUES
('36c90cd0-a676-42e0-a36f-90b37c1c66b4', 'Laura Yang', 'Vaquero López', 'lili@gmail.com', '55556666N', 'cliente', '2025-10-14'),
('577cd994-65ad-4988-a3a6-5abb4aeb6606', 'Laura', 'Vaquero', 'popo@gmail.com', '33334444Ñ', 'cliente', '2025-10-17'),
('58fc6059-ae5b-413a-8992-94dde5a67ade', 'Laura', 'Vaquero', 'laura@gmail.com', '48157895N', 'entrenador', '2025-10-17'),
('c942d0df-42a0-4339-ac2d-8a04ff276524', 'alicia', 'lopez pedraza', 'ali@gmail.com', '11112222N', 'entrenador', '2025-10-14'),
('d97f7125-9ea3-11f0-9c24-2c58b9490181', 'Mar?a', 'L?pez Fern?ndez', 'maria.lopez@example.com', '87654321B', 'entrenador', '2025-10-01'),
('d97fa46b-9ea3-11f0-9c24-2c58b9490181', 'Luc?a', 'Mart?nez Ruiz', 'lucia.martinez@example.com', '11223344C', 'cliente', '2025-10-01'),
('d97fa715-9ea3-11f0-9c24-2c58b9490181', 'Javier', 'S?nchez Torres', 'javier.sanchez@example.com', '22334455D', 'admin', '2025-10-01'),
('d97fa7ea-9ea3-11f0-9c24-2c58b9490181', 'Ana', 'G?mez Morales', 'ana.gomez@example.com', '33445566E', 'entrenador', '2025-10-01'),
('fa1c3e6c-c44b-4c55-ade2-c745f48a1ba7', 'Alicia', 'Pedraza', 'ala@gmail.com', '11112222L', 'cliente', '2025-10-17');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clases`
--
ALTER TABLE `clases`
  ADD PRIMARY KEY (`id_clase`),
  ADD KEY `id_entrenador` (`id_entrenador`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `contrataciones`
--
ALTER TABLE `contrataciones`
  ADD PRIMARY KEY (`id_contratacion`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_entrenador` (`id_entrenador`);

--
-- Indices de la tabla `detallepedidos`
--
ALTER TABLE `detallepedidos`
  ADD PRIMARY KEY (`id_detalle`),
  ADD UNIQUE KEY `id_pedido` (`id_pedido`,`id_producto`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `entrenadores`
--
ALTER TABLE `entrenadores`
  ADD PRIMARY KEY (`id_entrenador`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_cliente` (`id_cliente`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `resenias`
--
ALTER TABLE `resenias`
  ADD PRIMARY KEY (`id_resenia`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_entrenador` (`id_entrenador`);
  ADD KEY `id_contratacion` (`id_contratacion`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id_reserva`),
  ADD KEY `id_cliente` (`id_cliente`),
  ADD KEY `id_clase` (`id_clase`);

--
-- Indices de la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  ADD PRIMARY KEY (`id_seguimiento`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clases`
--
ALTER TABLE `clases`
  ADD CONSTRAINT `clases_ibfk_1` FOREIGN KEY (`id_entrenador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `contrataciones`
--
ALTER TABLE `contrataciones`
  ADD CONSTRAINT `contrataciones_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE,
  ADD CONSTRAINT `contrataciones_ibfk_2` FOREIGN KEY (`id_entrenador`) REFERENCES `entrenadores` (`id_entrenador`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detallepedidos`
--
ALTER TABLE `detallepedidos`
  ADD CONSTRAINT `detallepedidos_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `detallepedidos_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `entrenadores`
--
ALTER TABLE `entrenadores`
  ADD CONSTRAINT `entrenadores_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE;

--
-- Filtros para la tabla `resenias`
--
ALTER TABLE `resenias`
  ADD CONSTRAINT `resenias_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `resenias_ibfk_2` FOREIGN KEY (`id_entrenador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;
  ADD CONSTRAINT `resenias_ibfk_3` FOREIGN KEY (`id_contratacion`) REFERENCES `contrataciones` (`id_contratacion`) ON DELETE SET NULL;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`id_clase`) REFERENCES `clases` (`id_clase`) ON DELETE CASCADE;

--
-- Filtros para la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  ADD CONSTRAINT `seguimiento_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
