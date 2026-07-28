import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  constructor(private notificationsRepo: NotificationsRepository) { }

  async getNotifications(userId: number) {
    return this.notificationsRepo.findByUserId(userId);
  }

  async clearNotifications(userId: number) {
    return this.notificationsRepo.deleteByUserId(userId);
  }

  async createNotification(
    id_usuario: number,
    titulo: string,
    mensaje: string,
  ) {
    return this.notificationsRepo.create({
      id_usuario,
      titulo,
      mensaje,
    });
  }
}
