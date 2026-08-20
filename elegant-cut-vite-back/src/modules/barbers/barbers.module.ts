import { Module } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { BarbersRepository } from './barbers.repository';
import { BarbersController } from './barbers.controller';
import { BarbersAdminController } from './barbers-admin.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  // ─── SOLID: OCP ─────────────────────────────────────────────────────────────
  // Abierto a extensión (nuevos controllers por rol) sin modificar los
  // controllers ya existentes ni el Service.
  // ────────────────────────────────────────────────────────────────────────────
  controllers: [BarbersController, BarbersAdminController],
  providers: [BarbersService, BarbersRepository],
  exports: [BarbersService],
})
export class BarbersModule {}
