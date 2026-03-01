import { Module } from '@nestjs/common';
import { PqrsService } from './pqrs.service';
import { PqrsRepository } from './pqrs.repository';
import { PqrsController } from './pqrs.controller';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../../prisma/prisma.module';


@Module({
    imports: [EmailModule, PrismaModule],
    controllers: [PqrsController],
    providers: [PqrsService, PqrsRepository],
})
export class PqrsModule { }
