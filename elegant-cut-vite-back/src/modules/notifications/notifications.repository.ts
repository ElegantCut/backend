import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: number) {
    return this.prisma.notificaciones.findMany({
      where: { id_usuario: userId },
      orderBy: { fecha: 'desc' },
    });
  }

  async deleteByUserId(userId: number) {
    return this.prisma.notificaciones.deleteMany({
      where: { id_usuario: userId },
    });
  }

  async create(data: { id_usuario: number; titulo: string; mensaje: string }) {
    return this.prisma.notificaciones.create({
      data,
    });
  }
}
