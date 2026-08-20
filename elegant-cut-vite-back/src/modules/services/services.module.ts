import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesRepository } from './services.repository';
import { ServicesController } from './services.controller';
import { ServicesAdminController } from './services-admin.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  // ─── SOLID: OCP ─────────────────────────────────────────────────────────────
  // Abierto a extensión (nuevos controllers por rol) sin modificar los
  // controllers ya existentes ni el Service.
  // ────────────────────────────────────────────────────────────────────────────
  controllers: [ServicesController, ServicesAdminController],
  providers: [ServicesService, ServicesRepository],
  exports: [ServicesService],
})
export class ServicesModule {}
