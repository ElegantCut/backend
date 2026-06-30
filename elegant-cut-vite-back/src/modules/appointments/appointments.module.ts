import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsRepository } from './appointments.repository';
import { AppointmentsController } from './appointments.controller';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AppointmentsAdminController } from './appointments.admin.controller';

@Module({
  imports: [UsersModule, PrismaModule],
  controllers: [AppointmentsController, AppointmentsAdminController],
  providers: [AppointmentsService, AppointmentsRepository],
  exports: [AppointmentsService, AppointmentsRepository],
})
export class AppointmentsModule {}
