-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-12-2025 a las 10:12:10
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12
CREATE DATABASE IF NOT EXISTS uo289097_db;
USE uo289097_db;


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `uo289097_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `profesion` varchar(100) NOT NULL,
  `edad` int(10) UNSIGNED NOT NULL CHECK (`edad` between 12 and 105),
  `genero` enum('masculino','femenino') NOT NULL,
  `pericia_informatica` int(10) UNSIGNED NOT NULL CHECK (`pericia_informatica` between 0 and 10),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estructura de tabla para la tabla `observacion`
--

CREATE TABLE IF NOT EXISTS `observacion` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `observacion_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultado`
--

CREATE TABLE IF NOT EXISTS `resultado` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_usuario` int(10) UNSIGNED NOT NULL,
  `dispositivo` enum('ordenador','tableta','telefono') NOT NULL,
  `tiempo` float NOT NULL,
  `completada` tinyint(1) NOT NULL,
  `comentarios` text DEFAULT NULL,
  `propuestas` text DEFAULT NULL,
  `valoracion` int(11) NOT NULL CHECK (`valoracion` between 0 and 10),
  PRIMARY KEY (`id`),
  CONSTRAINT `resultado_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
