import { Module } from '@nestjs/common';
import { PqrsService } from './pqrs.service';
import { PqrsRepository } from './pqrs.repository';
import { PqrsController } from './pqrs.controller';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [EmailModule],
    controllers: [PqrsController],
    providers: [PqrsService, PqrsRepository],
})
export class PqrsModule { }
