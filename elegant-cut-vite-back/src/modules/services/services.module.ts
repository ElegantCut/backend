import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesRepository } from './services.repository';
import { ServicesController } from './services.controller';

@Module({
    controllers: [ServicesController],
    providers: [ServicesService, ServicesRepository],
    exports: [ServicesService],
})
export class ServicesModule { }
