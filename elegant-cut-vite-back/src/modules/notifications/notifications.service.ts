import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) { }

  async getNotifications(userId: number) {
    return this.prisma.notificaciones.findMany({
      where: { id_usuario: userId },
      orderBy: { fecha: 'desc' },
    });
  }

  async clearNotifications(userId: number) {
    return this.prisma.notificaciones.deleteMany({
      where: { id_usuario: userId },
    });
  }

  async createNotification(
    id_usuario: number,
    titulo: string,
    mensaje: string,
  ) {
    return this.prisma.notificaciones.create({
      data: {
        id_usuario,
        titulo,
        mensaje,
      },
    });
  }
}
