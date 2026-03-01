-- CreateTable
CREATE TABLE `codigos_verificacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `codigo` VARCHAR(6) NOT NULL,
    `tipo` ENUM('registro', 'recuperacion') NOT NULL,
    `expira_en` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `usado` BOOLEAN NULL DEFAULT false,
    `creado_en` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_email_codigo`(`email`, `codigo`, `tipo`, `usado`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detalle_cita_servicio` (
    `id_detalle_cita_servicio` INTEGER NOT NULL AUTO_INCREMENT,
    `id_reservas` INTEGER NULL,
    `id_servicio` INTEGER NULL,

    INDEX `fk_detalle_reserva`(`id_reservas`),
    INDEX `fk_detalle_servicio`(`id_servicio`),
    PRIMARY KEY (`id_detalle_cita_servicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estado_cita` (
    `id_estado_cita` INTEGER NOT NULL AUTO_INCREMENT,
    `confirmada` BOOLEAN NULL DEFAULT true,

    PRIMARY KEY (`id_estado_cita`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `horarios` (
    `id_horarios` INTEGER NOT NULL AUTO_INCREMENT,
    `hora_inicio` INTEGER NOT NULL,
    `hora_fin` INTEGER NOT NULL,

    PRIMARY KEY (`id_horarios`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagos` (
    `id_pago` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(0) NOT NULL,
    `valor` DECIMAL(10, 2) NOT NULL,
    `id_tipo_pago` INTEGER NULL,
    `id_reservas` INTEGER NULL,

    INDEX `fk_pago_reserva`(`id_reservas`),
    INDEX `fk_pago_tipo`(`id_tipo_pago`),
    PRIMARY KEY (`id_pago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resenas` (
    `id_resena` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_cliente` VARCHAR(100) NOT NULL,
    `email_cliente` VARCHAR(100) NOT NULL,
    `calificacion` INTEGER NOT NULL,
    `comentario` TEXT NOT NULL,
    `fecha_resena` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `estado` TINYINT NULL DEFAULT 1,

    PRIMARY KEY (`id_resena`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservas` (
    `id_reservas` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(0) NOT NULL,
    `observaciones` VARCHAR(70) NULL,
    `id_usuario` INTEGER NULL,
    `id_empleado` INTEGER NULL,
    `id_estado_cita` INTEGER NULL,
    `id_horarios` INTEGER NULL,

    INDEX `fk_reserva_estado`(`id_estado_cita`),
    INDEX `fk_reserva_horario`(`id_horarios`),
    INDEX `fk_reserva_usuario`(`id_usuario`),
    PRIMARY KEY (`id_reservas`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios` (
    `id_servicio` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(70) NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `duracion` INTEGER NOT NULL,

    PRIMARY KEY (`id_servicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipo_pago` (
    `id_tipo_pago` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(70) NULL,

    PRIMARY KEY (`id_tipo_pago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NULL,
    `prim_nombre` VARCHAR(70) NOT NULL,
    `seg_nombre` VARCHAR(70) NULL,
    `apellido1` VARCHAR(70) NOT NULL,
    `apellido2` VARCHAR(70) NULL,
    `email` VARCHAR(70) NOT NULL,
    `password_hash` VARCHAR(255) NULL,
    `telefono` VARCHAR(20) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `id_rol` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `foto_perfil` LONGTEXT NULL,

    UNIQUE INDEX `username`(`username`),
    INDEX `fk_rol_usuario`(`id_rol`),
    PRIMARY KEY (`id_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detalle_cita_servicio` ADD CONSTRAINT `fk_detalle_reserva` FOREIGN KEY (`id_reservas`) REFERENCES `reservas`(`id_reservas`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `detalle_cita_servicio` ADD CONSTRAINT `fk_detalle_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicios`(`id_servicio`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pagos` ADD CONSTRAINT `fk_pago_reserva` FOREIGN KEY (`id_reservas`) REFERENCES `reservas`(`id_reservas`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pagos` ADD CONSTRAINT `fk_pago_tipo` FOREIGN KEY (`id_tipo_pago`) REFERENCES `tipo_pago`(`id_tipo_pago`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `fk_reserva_estado` FOREIGN KEY (`id_estado_cita`) REFERENCES `estado_cita`(`id_estado_cita`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `fk_reserva_horario` FOREIGN KEY (`id_horarios`) REFERENCES `horarios`(`id_horarios`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `fk_reserva_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `fk_rol_usuario` FOREIGN KEY (`id_rol`) REFERENCES `rol`(`id_rol`) ON DELETE RESTRICT ON UPDATE RESTRICT;
