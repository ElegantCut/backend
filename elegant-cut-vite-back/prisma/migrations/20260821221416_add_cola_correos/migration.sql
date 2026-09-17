/*
  Warnings:

  - A unique constraint covering the columns `[google_id]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `resenas` DROP FOREIGN KEY `fk_resenas_barbero`;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `google_id` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `notificaciones` (
    `id_notificacion` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(100) NOT NULL,
    `mensaje` TEXT NOT NULL,
    `fecha` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `leida` BOOLEAN NULL DEFAULT false,
    `id_usuario` INTEGER NOT NULL,

    INDEX `fk_usuario_notificacion`(`id_usuario`),
    PRIMARY KEY (`id_notificacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cola_correos` (
    `id_cola` INTEGER NOT NULL AUTO_INCREMENT,
    `destinatario` VARCHAR(100) NOT NULL,
    `asunto` VARCHAR(150) NOT NULL,
    `cuerpo_html` TEXT NOT NULL,
    `estado` VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    `intentos` INTEGER NOT NULL DEFAULT 0,
    `error_ultimo` TEXT NULL,
    `fecha_creado` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `fecha_intento` DATETIME(0) NULL,

    PRIMARY KEY (`id_cola`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `google_id` ON `usuarios`(`google_id`);

-- AddForeignKey
ALTER TABLE `resenas` ADD CONSTRAINT `fk_resenas_barbero` FOREIGN KEY (`id_barbero`) REFERENCES `usuarios`(`id_usuario`) ON DELETE SET NULL ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `notificaciones` ADD CONSTRAINT `fk_usuario_notificacion` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id_usuario`) ON DELETE CASCADE ON UPDATE RESTRICT;
