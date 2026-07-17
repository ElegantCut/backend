import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PqrsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    const { tipo_solicitud, asunto, descripcion, id_usuario, estado } = data;
    const result = await this.prisma.pqrs.create({
      data: {
        tipo: tipo_solicitud || 'Peticion', // Valor por defecto del enum pqrs_tipo si no viene
        asunto,
        descripcion,
        estado: estado || 'Pendiente', // Valor por defecto del enum pqrs_estado
        id_usuario,
      },
    });
    return result.id_pqrs;
  }

  async findByUserData(email: string) {
    return this.prisma.pqrs.findMany({
      where: {
        usuarios: {
          email: email,
        },
      },
      include: {
        usuarios: true, 
      },
    });
  }

  async obtenerPqrs() {
    return this.prisma.pqrs.findMany({
      include: {
        usuarios: {
          select: { prim_nombre: true, email: true, telefono: true },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.pqrs.findUnique({
      where: { id_pqrs: id },
      include: {
        usuarios: {
          select: {
            prim_nombre: true,
            apellido1: true,
            email: true,
            telefono: true,
          },
        },
      },
    });
  }

  async update(id: number, data: any) {
    return this.prisma.pqrs.update({
      where: { id_pqrs: id },
      data,
    });
  }

  async findByRadicado(id: number) {
    return this.prisma.pqrs.findUnique({
      where: { id_pqrs: id },
      select: {
        estado: true,
        fecha_creacion: true,
        respuesta_admin: true,
      },
    });
  }
}
