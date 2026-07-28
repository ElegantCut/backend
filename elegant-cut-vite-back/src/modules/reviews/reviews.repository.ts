import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsRepository {
  constructor(private prisma: PrismaService) {}

  async findAllApproved() {
    return this.prisma.resenas.findMany({
      where: { estado: 1 },
      orderBy: { fecha_resena: 'desc' },
      include: {
        barbero: {
          select: {
            id_usuario: true,
            prim_nombre: true,
            apellido1: true,
          },
        },
        usuarios_resenas_id_clienteTousuarios: {
          select: {
            prim_nombre: true,
          },
        },
      },
    });
  }

  async create(data: any) {
    const { calificacion, comentario, id_barbero, id_cliente } = data;
    const result = await this.prisma.resenas.create({
      data: {
        id_cliente: id_cliente ? Number(id_cliente) : null,
        calificacion: Number(calificacion),
        comentario,
        id_barbero: id_barbero ? Number(id_barbero) : null,
        estado: 1, // Forzamos estado activo para que sea visible de inmediato
      },
    });
    return result;
  }

  async obtenerResenas() {
    return this.prisma.resenas.findMany({
      where: { estado: 1 },
      orderBy: { fecha_resena: 'desc' },
      include: {
        barbero: {
          select: {
            id_usuario: true,
            prim_nombre: true,
            apellido1: true,
          },
        },
        usuarios_resenas_id_clienteTousuarios: {
          select: {
            prim_nombre: true,
            apellido1: true,
          },
        },
      },
    });
  }

  async findAllAdmin(status?: string) {
    const where: any = {};
    if (status === 'approved') where.estado = 1;
    if (status === 'spam') where.estado = 0;

    return this.prisma.resenas.findMany({
      where,
      orderBy: { fecha_resena: 'desc' },
      include: {
        barbero: {
          select: {
            id_usuario: true,
            prim_nombre: true,
            apellido1: true,
          },
        },
        usuarios_resenas_id_clienteTousuarios: {
          select: {
            username: true,
            prim_nombre: true,
            apellido1: true,
            email: true,
          },
        },
      },
    });
  }

  async changeStatusAdmin(id: number, nuevoEstado: number) {
    return this.prisma.resenas.update({
      where: { id_resena: id },
      data: { estado: nuevoEstado },
    });
  }

  async findById(id: number) {
    return this.prisma.resenas.findUnique({
      where: { id_resena: id },
    });
  }

  async deleteAdmin(id: number) {
    return this.prisma.resenas.delete({
      where: { id_resena: id },
    });
  }

  async findBarberReviews(idBarbero: number) {
    return this.prisma.resenas.findMany({
      where: {
        id_barbero:
          idBarbero && !isNaN(Number(idBarbero)) ? Number(idBarbero) : null,
        estado: 1,
      },
      include: {
        usuarios_resenas_id_clienteTousuarios: {
          select: {
            prim_nombre: true,
          },
        },
      },
      orderBy: { fecha_resena: 'desc' },
      take: 10, // Mostrar solo los últimos 10
    });
  }
}
