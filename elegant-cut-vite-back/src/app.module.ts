import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module'; // La ruta a tu carpeta prisma
import { AuthModule } from './modules/auth/auth.module';
import { BarbersModule } from './modules/barbers/barbers.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ServicesModule } from './modules/services/services.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PqrsModule } from './modules/pqrs/pqrs.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { UsersModule } from './modules/users/users.module';
import { EmailModule } from './modules/email/email.module';
import { PortabarberoModule } from './portabarbero/portabarbero.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // En Docker, las variables llegan del docker-compose environment:, no de un .env
      // ignoreEnvFile evita que NestJS busque un .env inexistente y pierda las vars del proceso
      ignoreEnvFile: process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BarbersModule,
    AppointmentsModule,
    ClientsModule,
    ServicesModule,
    ReviewsModule,
    PqrsModule,
    DashboardModule,
    EmailModule,
    PortabarberoModule,
    UploadsModule,
  ],
})
export class AppModule { }

