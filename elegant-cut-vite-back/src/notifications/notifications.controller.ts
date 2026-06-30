import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';

@Controller('notificaciones')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getNotifications(@Request() req) {
    const userId = req.user.id_usuario || req.user.sub || req.user.id;
    return this.notificationsService.getNotifications(Number(userId));
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async clearNotifications(@Request() req) {
    const userId = req.user.id_usuario || req.user.sub || req.user.id;
    await this.notificationsService.clearNotifications(Number(userId));
    return { success: true, message: 'Notificaciones limpiadas' };
  }

  // Endpoint para n8n (sin JwtAuthGuard por simplicidad para la automatización inicial)
  @Post('n8n')
  async createNotificationFromN8N(
    @Body() body: { id_usuario: number; titulo: string; mensaje: string },
  ) {
    return this.notificationsService.createNotification(
      body.id_usuario,
      body.titulo,
      body.mensaje,
    );
  }
}
