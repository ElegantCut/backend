import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { ClientsController } from './clients.controller';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { USER_INTEGRATION_SERVICE } from './interfaces/user-integration.interface';

@Module({
  imports: [PrismaModule], // <-- Esto es lo que permite que el service use Prisma
  controllers: [UsersController, ClientsController, AdminController],
  providers: [UsersService, UsersRepository, {
    provide: USER_INTEGRATION_SERVICE,
    useExisting: UsersService
  }],
  exports: [UsersService, UsersRepository, USER_INTEGRATION_SERVICE],// exportamos el token ara que auth pueda usarlo uwu
})
export class UsersModule { }
