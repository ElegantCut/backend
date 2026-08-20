-- =============================================
-- SCRIPT DE BASELINING + RESTAURACIÓN DE DATOS
-- =============================================
-- Este script:
-- 1. Crea la tabla _prisma_migrations (si no existe)
-- 2. Marca la migración init como "ya aplicada" 
-- 3. Restaura todos los datos desde el backup
-- =============================================

-- PASO 1: Crear tabla _prisma_migrations
CREATE TABLE IF NOT EXISTS `_prisma_migrations` (
    `id` VARCHAR(36) NOT NULL,
    `checksum` VARCHAR(64) NOT NULL,
    `finished_at` DATETIME(3) NULL,
    `migration_name` VARCHAR(255) NOT NULL,
    `logs` TEXT NULL,
    `rolled_back_at` DATETIME(3) NULL,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `applied_steps_count` INT UNSIGNED NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- PASO 2: Marcar la migración init como ya aplicada
-- (Esto evita que prisma migrate deploy intente recrear las tablas)
INSERT IGNORE INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`)
VALUES (
    'baseline-001',
    '0000000000000000000000000000000000000000000000000000000000000000',
    NOW(3),
    '20260228191027_init',
    NULL,
    NULL,
    NOW(3),
    1
);

-- PASO 3: Restaurar datos
SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET NAMES utf8mb4;

-- ========================
-- Tabla: rol
-- ========================
INSERT IGNORE INTO `rol` (`id_rol`, `nombre_rol`) VALUES
(1,'Administrador'),
(2,'Cliente'),
(3,'Barbero');

-- ========================
-- Tabla: genero_servicio
-- ========================
INSERT IGNORE INTO `genero_servicio` (`id_genero`, `nombre`) VALUES
(1,'Caballero'),
(2,'Dama');

-- ========================
-- Tabla: categorias
-- ========================
INSERT IGNORE INTO `categorias` (`id_categoria`, `nombre`, `descripcion`, `estado`, `id_genero`) VALUES
(7,'Cortes de Cabello','Servicios de corte de cabello masculino clasico y moderno',1,1),
(8,'Barba y Afeitado','Arreglo, perfilado y afeitado de barba',1,1),
(9,'Tratamientos Especiales','Servicios adicionales como mascarillas y cuidado facial',1,1),
(11,'Unas','Servicios de manicure, pedicure y cuidado de unas',1,2),
(12,'Cortes Cabello Largo','Cortes disenados para cabello largo',1,2),
(13,'Cortes Cabello Corto','Cortes modernos y clasicos para cabello corto',1,2),
(14,'Color / Tintes','Aplicacion de tintes, decoloracion y coloracion capilar',1,2),
(15,'Peinados','Peinados para eventos y ocasiones especiales',1,2),
(16,'Mascarillas','Tratamientos capilares y faciales con mascarillas',1,2);

-- ========================
-- Tabla: usuarios
-- ========================
INSERT IGNORE INTO `usuarios` (`id_usuario`, `username`, `prim_nombre`, `seg_nombre`, `apellido1`, `apellido2`, `email`, `password_hash`, `telefono`, `estado`, `id_rol`, `created_at`, `updated_at`, `foto_perfil`) VALUES
(2,'nicolas_dev','Nicolas','Andres','Minguez','Garcia','nicolas@example.com','$2a$10$EjemploDeHashBcryptAqui...','123456789',0,2,'2026-02-28 19:44:12','2026-02-28 19:44:12','profiles/default.png'),
(3,'danny_ben','Daniel','Felipe','Bentancour','Perez','danny_bar@email.com','$2b$10$oUntsptl4bLQLydq5Z8Zf.SN75WpVTzb4QxkVcsk5UuqwRDkpEnqe','3109876543',1,3,'2026-03-01 19:44:41','2026-03-01 19:44:41','danni_bentancour_cavhya'),
(4,'juan_perez88','Juan','Camilo','Perez','Rodriguez','juan.perez@email.com','$2a$10$HashSeguroDePrueba12345','3201112233',0,1,'2026-03-01 20:01:27','2026-03-01 20:01:27','profiles/user_default.png'),
(5,'Lucho diaz','Luis','Fernando','Diaz','Garcia','LuisDiaz@example.com','$2b$10$plmD2ptHyE49OrrCAQoDteWNLzsVBlOw..oUk7ftFfEhTeFxt36C6','4055874521',1,2,'2026-03-02 02:02:31','2026-03-02 02:02:31','profiles/default.png'),
(6,'Alejandro_mora','Alejandro','Daniel','Mora','Paez','mora_bar@email.com','$2b$10$SA7xrudOkfrke6fq9HoscOO7Mgf71PtzRt5pYgAkokCUetBAURlbi','3213925370',1,3,'2026-03-03 03:26:30','2026-03-03 03:26:30','Alejandro_Mora_ljpxsm'),
(7,'Cris_di','Cristian','Daniel','Diaz','Molina','diaz_bar@email.com','$2b$10$vSMatbveFWokECb7ZQtceem98hv7nq6LUF2h6wijtEVKDdbBfdagO','3115548752',1,3,'2026-03-03 08:36:51','2026-03-03 08:36:51','cridtian_diaz_vfykyh'),
(8,'Luz','luz','franco','marina','hernandez','jn147880@gmail.com','$2b$10$HcHuhFHPaOHNhOQbynfQneDGfA8OtJf28c.lgGSuVhUQzwbOHSUmW','32255669878',1,2,'2026-03-03 09:07:16','2026-03-03 09:07:16',NULL),
(9,'weba','xd','xd','xd','xd','elkinsanchezp@gmail.com','$2b$10$IQ4xFW8IEJRs0LRaTRgBcOR5.LgOMFhg7HSMOXZFPW4C3y1GC4Rn.','3214588745',1,2,'2026-03-05 03:14:02','2026-03-05 03:14:02',NULL),
(10,'Ferney_con','Ferney','Segundo','Contalvo','Ramirez','ferney_bar@gmail.com','$2b$10$BqUUIXIv4AgterFgFhvc1evAmN881c4qoxfK/.RpuFZkjmJ2527x6','3024025569',1,3,'2026-03-07 01:16:42','2026-03-07 01:16:42','Ferney_Contalvo_xh0ht1'),
(11,'Mauro_novoa','Mauricio','Facundo','Novoa','Novoa','mauro_bar@gmail.com','$2b$10$pIpfhlpKHzTn5xgKAzLYeeS46.dJE5yR9LJqTy0/BqQoXOB3zr62y','30240258745',1,3,'2026-03-07 01:19:50','2026-03-07 01:19:50','mauricio_novoa_n6tf8n'),
(12,'Juli_cor','Julian','Raul','Cordero','Novoa','julian_cor@gmail.com','$2b$10$mLKr4lqxEhJgHwSFVZ9/P.qKdYYkx9wlpOaV/j94FKySMdnfTrEf.','3144091434',1,3,'2026-03-07 01:23:09','2026-03-07 01:23:09','julian_cordero_m0gw8l'),
(13,'Camila_puen','Camila','Juliana','Puentes','Cordero','Camila_puen@gmail.com','$2b$10$3jjSbd158fL1KLJCkdOaG.2gZx5nKO/Dtxrm2uEkJ0ehvWPfy9AEy','3214578621',1,3,'2026-03-07 01:28:07','2026-03-07 01:28:07','Camila_Puentes_oijyph'),
(14,'Guevara','Edwar','Edwar','G','Guevara','edwarsgl0318@gmail.com','$2b$10$BmghIDgI4.6JmaPnprjKbuc/tQr/yP1k7Q/M2zdNhIc9LTmmJEiGK','',1,2,'2026-03-26 08:08:39','2026-03-26 08:08:39',NULL),
(20,'palitoo','Edwar','Edwar','juan','Guevara','edwarsgl0318@gmail.com','$2b$10$ulqqCqhwVrQYQeVL.Tw4oONzgGmpXGMAtcry/NktLKHoMXxiP67kG','123',1,2,'2026-03-26 08:47:46','2026-03-26 08:47:46',NULL),
(21,'ap','ap','','ap','','aa@gmail.com','$2b$10$barKUbN0Jtnus07fCmXDS.UJTVAhAlMuHihJr6/d9UCBp4yHwhFsO','12345678',1,2,'2026-04-05 18:24:42','2026-04-05 18:24:42',NULL),
(23,'bbb','bbb','bbb','bbb','bb','bbb@gmail.com','$2b$10$jJYeoUv4AWBxGglmTfz7XOdRasocUZ7HxXnn/x0AdPp9IzO/cDdn6','bb',1,2,'2026-04-06 04:01:28','2026-04-06 04:01:28',NULL),
(24,'luis','luis','','luis','','c@GMAIL.COM','$2b$10$ykYBFw6QpRQolUqPw4BfrO15moER3x8bFWBJKdCjclHifCOS7uoO2','32313',1,2,'2026-04-06 04:56:25','2026-04-06 04:56:25',NULL),
(25,'Pal','edd','Edwar','luis','Guevara','edwarsgl@gmail.com','$2b$10$mweKYeuF9B2Bcqx21F/87e1ed.aAU8IJjmAQA9MVyuYeScsOpaMgS','32313',1,2,'2026-04-06 06:06:11','2026-04-06 06:06:11',NULL),
(27,'Luisss','Edwar','Edwar','aaa','Guevara','edwarsgl03182@gmail.com','$2b$10$qkrg7EL2d/UlQiil/HG7J.6f3pK3CUoezHo1pcPilkbexD34Z8rb2','',1,2,'2026-04-07 21:02:05','2026-04-07 21:02:05',NULL),
(28,'angeldeb','Angel','','Leal','','angellealmolina30@gmail.com','$2b$10$g1R5ydBNIxZ/8.108rMgWezcgejX0E1MchLpyxY4/YiKGq8dtrl2m','3213122',1,2,'2026-04-07 21:28:21','2026-04-07 21:28:21',NULL),
(29,'che','Jorge ','echeverry','nicolas','Calvo','jn147860@gmail.com','$2b$10$d8APuNAWK7Vrc7YWaWroKuXY4aKcK.Of1DsMS1kfvf5SxGux2mlo6','3213925370',1,2,'2026-04-07 21:33:57','2026-04-07 21:33:57',NULL);

-- ========================
-- Tabla: servicios
-- ========================
INSERT IGNORE INTO `servicios` (`id_servicio`, `nombre`, `precio`, `duracion`, `id_categoria`, `descripcion`, `imagen`) VALUES
(11,'Fade (Degradado)',18000.00,40,7,'Degradado bajo, medio o alto con transicion limpia','fade_kpg382'),
(12,'Taper Fade',18000.00,40,7,'Degradado sutil en patillas y nuca','taper_fade_yilrmn'),
(13,'Undercut',20000.00,45,7,'Laterales cortos con desconexion superior','under_cut_eoi8ul'),
(14,'French Crop',18000.00,40,7,'Corte con flequillo texturizado al frente','french_crop_sw9lfc'),
(15,'Broccoli Haircut',22000.00,50,7,'Corte con volumen y rizos moderno juvenil','Broccoli_Haircut_vcfikn'),
(16,'Mullet Moderno',22000.00,50,7,'Corto adelante y largo atras con estilo moderno','mullet_yjcceg'),
(17,'Burst Fade / Mohicano',20000.00,45,7,'Degradado en arco estilo mohicano','mullet_i5oqn3'),
(18,'eBoy Cut',18000.00,40,7,'Corte con raya al medio tipo librito','librito_fefjuw'),
(19,'Buzz Cut',12000.00,20,7,'Rapado uniforme en toda la cabeza','buzcut_hptyju'),
(21,'Pompadour',20000.00,45,7,'Volumen superior peinado hacia atras','pompadour_e9auj6'),
(22,'Side Part',18000.00,40,7,'Corte clasico con raya al lado','side_part_klxqgq'),
(23,'Barba 3 dias',8000.00,20,8,'Barba corta tipo sombra','barba_3_dias_nkdkyt'),
(24,'Barba corporativa',10000.00,25,8,'Barba perfilada y uniforme','barba_corpo_yfvc0z'),
(26,'Barba candado',9000.00,20,8,'Barba solo en barbilla y bigote','candao_z4rnfy'),
(27,'Barba balbo',12000.00,25,8,'Barba sin patillas con bigote separado','balbo_scpfhn'),
(29,'Barba circular',10000.00,25,8,'Barba en forma circular cerrada','circular_cerrada_cepvvy'),
(30,'Van Dyke',12000.00,25,8,'Perilla puntiaguda con bigote fino','van_dyke_n4rtmh'),
(33,'Garibaldi',16000.00,35,8,'Barba larga y redondeada','garibaldi_mjhlai'),
(35,'Perilla',7000.00,15,8,'Vello solo en barbilla','perilla_lasqn1'),
(37,'Mutton Chops',12000.00,25,8,'Patillas gruesas con bigote','mutton_u3dn43'),
(38,'Keratina Caballero',80000.00,90,9,'Tratamiento de alisado y reparacion capilar','keratina_sncx1b'),
(39,'Tinte Cabello Corto',50000.00,60,9,'Coloracion en cabello corto','tinte_corto_ze8aqi'),
(40,'Tinte Cabello Largo',120000.00,90,9,'Coloracion en cabello largo','tinte_largo_lypdkh'),
(48,'nuevo',1222.00,20,NULL,NULL,NULL);

-- ========================
-- Tabla: barberos_servicios
-- ========================
INSERT IGNORE INTO `barberos_servicios` (`id_barbero_servicio`, `id_barbero`, `id_servicio`) VALUES
(1,3,11),(2,6,11),(3,7,11),(4,10,11),(5,11,11),(6,12,11),(7,13,11),
(8,3,12),(9,6,12),(10,7,12),(11,10,12),(12,11,12),(13,12,12),(14,13,12),
(15,3,13),(16,6,13),(17,7,13),(18,10,13),(19,11,13),(20,12,13),(21,13,13),
(22,3,14),(23,6,14),(24,7,14),(25,10,14),(26,11,14),(27,12,14),(28,13,14),
(29,3,15),(30,6,15),(31,7,15),(32,10,15),(33,11,15),(34,12,15),(35,13,15),
(36,3,16),(37,6,16),(38,7,16),(39,10,16),(40,11,16),(41,12,16),(42,13,16),
(43,3,17),(44,6,17),(45,7,17),(46,10,17),(47,11,17),(48,12,17),(49,13,17),
(50,3,18),(51,6,18),(52,7,18),(53,10,18),(54,11,18),(55,12,18),(56,13,18),
(57,3,19),(58,6,19),(59,7,19),(60,10,19),(61,11,19),(62,12,19),(63,13,19),
(71,3,21),(72,6,21),(73,7,21),(74,10,21),(75,11,21),(76,12,21),(77,13,21),
(78,3,22),(79,6,22),(80,7,22),(81,10,22),(82,11,22),(83,12,22),(84,13,22),
(85,3,23),(86,6,23),(87,7,23),(88,10,23),(89,11,23),(90,12,23),(91,13,23),
(92,3,24),(93,6,24),(94,7,24),(95,10,24),(96,11,24),(97,12,24),(98,13,24),
(106,3,26),(107,6,26),(108,7,26),(109,10,26),(110,11,26),(111,12,26),(112,13,26),
(113,3,27),(114,6,27),(115,7,27),(116,10,27),(117,11,27),(118,12,27),(119,13,27),
(127,3,29),(128,6,29),(129,7,29),(130,10,29),(131,11,29),(132,12,29),(133,13,29),
(134,3,30),(135,6,30),(136,7,30),(137,10,30),(138,11,30),(139,12,30),(140,13,30),
(155,3,33),(156,6,33),(157,7,33),(158,10,33),(159,11,33),(160,12,33),(161,13,33),
(169,3,35),(170,6,35),(171,7,35),(172,10,35),(173,11,35),(174,12,35),(175,13,35),
(183,3,37),(184,6,37),(185,7,37),(186,10,37),(187,11,37),(188,12,37),(189,13,37),
(256,3,38),(257,11,38),(258,13,38),
(259,3,39),(260,7,39),(261,10,39),(262,11,39),(263,13,39),
(264,3,40),(265,7,40),(266,10,40),(267,11,40),(268,13,40);

-- ========================
-- Tabla: estado_cita
-- ========================
INSERT IGNORE INTO `estado_cita` (`id_estado_cita`, `confirmada`) VALUES
(1,0);

-- ========================
-- Tabla: horarios
-- ========================
INSERT IGNORE INTO `horarios` (`id_horarios`, `hora_inicio`, `hora_fin`) VALUES
(1,8,9);

-- ========================
-- Tabla: reservas
-- ========================
INSERT IGNORE INTO `reservas` (`id_reservas`, `fecha`, `observaciones`, `id_usuario`, `id_empleado`, `id_estado_cita`, `id_horarios`) VALUES
(6,'2026-03-15 00:00:00','Corte degradado con diseno en la nuca',2,3,1,1),
(7,'2026-03-02 00:00:00','me gustaria loneas',2,3,1,1),
(8,'2026-03-05 00:00:00','me gistaria hacerme un decoloraod tambien',2,6,1,1),
(9,'2026-03-11 00:00:00','Me gustria la linea',2,13,1,1),
(10,'2026-04-08 00:00:00','Cita agendada desde el Perfil',25,6,1,1);

-- ========================
-- Tabla: detalle_cita_servicio
-- ========================
INSERT IGNORE INTO `detalle_cita_servicio` (`id_detalle_cita_servicio`, `id_reservas`, `id_servicio`) VALUES
(1,10,27);

-- ========================
-- Tabla: codigos_verificacion
-- ========================
INSERT IGNORE INTO `codigos_verificacion` (`id`, `email`, `codigo`, `tipo`, `expira_en`, `usado`, `creado_en`) VALUES
(1,'danny_bar@email.com','584349','recuperacion','2026-03-26 08:57:55',0,'2026-03-26 08:42:55'),
(2,'edwarsgl@gmail.com','467732','recuperacion','2026-04-06 06:21:20',0,'2026-04-06 06:06:20'),
(3,'edwarsgl@gmail.com','890934','recuperacion','2026-04-06 06:32:48',0,'2026-04-06 06:17:48'),
(4,'edwarsgl@gmail.com','277616','recuperacion','2026-04-06 06:37:32',0,'2026-04-06 06:22:32'),
(5,'edwarsgl@gmail.com','599962','recuperacion','2026-04-06 06:44:18',0,'2026-04-06 06:29:18'),
(6,'bbb@gmail.com','904417','recuperacion','2026-04-06 07:53:34',0,'2026-04-06 07:38:34'),
(7,'edwarsgl0318@gmail.com','626228','recuperacion','2026-04-07 21:40:47',0,'2026-04-07 21:25:47'),
(8,'angellealmolina30@gmail.com','745127','recuperacion','2026-04-07 21:43:36',0,'2026-04-07 21:28:36');

-- ========================
-- Tabla: portafolios
-- ========================
INSERT IGNORE INTO `portafolios` (`id_portafolio`, `id_usuario`, `biografia`, `experiencia`, `especialidades`, `calificacion`, `instagram`, `fotos_portafolio`, `rese_as_count`) VALUES
(1,6,'Desarrollador con mas de 8 anos de experiencia en soluciones en la nube.','Senior Full Stack Developer','["Node.js","Prisma ORM","NestJS","Arquitectura Hexagonal"]',4.50,'https://instagram.com/dev_profile','["https://tu-bucket.com/proyecto1.jpg","https://tu-bucket.com/proyecto2.jpg"]',0);

-- ========================
-- Tabla: pqrs
-- ========================
INSERT IGNORE INTO `pqrs` (`id_pqrs`, `tipo`, `asunto`, `descripcion`, `fecha_creacion`, `estado`, `id_usuario`, `respuesta_admin`) VALUES
(1,'Sugerencia','Mejorar aire acondicionado','Estaria genial que el local estuviera mas fresco.','2026-03-01 14:14:50','Pendiente',2,NULL);

-- ========================
-- Tabla: resenas
-- ========================
INSERT IGNORE INTO `resenas` (`id_resena`, `calificacion`, `comentario`, `fecha_resena`, `estado`, `id_barbero`, `id_cliente`) VALUES
(1,5,'Excelente servicio, el sistema de gestion esta quedando genial.','2026-03-01 15:05:42',0,3,2);

-- Reactivar verificaciones
SET FOREIGN_KEY_CHECKS=1;

SELECT 'BASELINING + RESTAURACION COMPLETADA EXITOSAMENTE' AS resultado;
