CREATE DATABASE  IF NOT EXISTS `api` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `api`;
-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: api
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `parametros_do_pedido`
--

DROP TABLE IF EXISTS `parametros_do_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parametros_do_pedido` (
  `par_codigo` int NOT NULL AUTO_INCREMENT,
  `regra_tipo` varchar(50) DEFAULT NULL,
  `regra_valor` varchar(100) DEFAULT NULL,
  `prod_codigo` int NOT NULL,
  `ped_codigo` int NOT NULL,
  `reg_codigo` int DEFAULT NULL,
  PRIMARY KEY (`par_codigo`),
  KEY `fk_produto_parametro` (`prod_codigo`),
  KEY `fk_pedido_parametro` (`ped_codigo`),
  CONSTRAINT `fk_regra_parametro` FOREIGN KEY (`reg_codigo`) REFERENCES `regras_de_recebimento` (`reg_codigo`),
  CONSTRAINT `fk_pedido_parametro` FOREIGN KEY (`ped_codigo`) REFERENCES `pedido` (`ped_codigo`),
  CONSTRAINT `fk_produto_parametro` FOREIGN KEY (`prod_codigo`) REFERENCES `produto` (`prod_codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parametros_do_pedido`
--

LOCK TABLES `parametros_do_pedido` WRITE;
/*!40000 ALTER TABLE `parametros_do_pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `parametros_do_pedido` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-03 17:51:01
