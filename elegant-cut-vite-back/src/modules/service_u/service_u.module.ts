import { Module } from '@nestjs/common';
import { ServiceUService } from './serviceu.service';
import { ServiceUController } from './serviceu.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceUController],
  providers: [ServiceUService],
  exports: [ServiceUService],
})
export class ServiceUModule {}
