import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { ClientsController } from './clients.controller';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../../prisma/prisma.module'; // Asegúrate de que la ruta suba los niveles necesarios

@Module({
    imports: [PrismaModule], // <-- Esto es lo que permite que el service use Prisma
    controllers: [UsersController, ClientsController, AdminController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService, UsersRepository],
})
export class UsersModule { }
