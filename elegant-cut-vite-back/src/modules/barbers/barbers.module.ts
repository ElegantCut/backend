import { Module } from '@nestjs/common';
import { BarbersService } from './barbers.service';
import { BarbersRepository } from './barbers.repository';
import { BarbersController } from './barbers.controller';
import { PrismaModule } from '../../prisma/prisma.module';


@Module({
    imports: [PrismaModule],
    controllers: [BarbersController],
    providers: [BarbersService, BarbersRepository],
    exports: [BarbersService],
})
export class BarbersModule { }
