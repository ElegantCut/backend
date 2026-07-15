import { Module } from '@nestjs/common';
import { PortabarberoController } from './portabarbero.controller';
import { PortabarberoService } from './portabarbero.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PortabarberoController],
  providers: [PortabarberoService],
})
export class PortabarberoModule { }
