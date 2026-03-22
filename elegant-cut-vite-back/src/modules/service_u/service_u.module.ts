import { Module } from '@nestjs/common';
import { PqrsService } from '../pqrs/pqrs.service';
import { PqrsRepository } from '../pqrs/pqrs.repository';
import { PqrsController } from '../pqrs/pqrs.controller';
import { EmailModule } from '../email/email.module';
import { PrismaModule } from '../../prisma/prisma.module';


@Module({
    imports: [EmailModule, PrismaModule],
    controllers: [PqrsController],
    providers: [PqrsService, PqrsRepository],
})
export class PqrsModule { }
