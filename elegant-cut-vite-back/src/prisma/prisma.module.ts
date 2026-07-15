import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';


@Module({
  providers: [PrismaService],
  exports: [PrismaService], // ¡Muy importante!
})
export class PrismaModule { }
