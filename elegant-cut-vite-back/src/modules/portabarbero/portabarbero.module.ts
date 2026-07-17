import { Module } from '@nestjs/common';
import { PortabarberoService } from './portabarbero.service';
import { PortabarberoController } from './portabarbero.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { PortabarberoRepository } from './portabarbero.repository';

@Module({
  imports: [PrismaModule],
  providers: [PortabarberoService, PortabarberoRepository],
  controllers: [PortabarberoController],
})
export class PortabarberoModule {}
