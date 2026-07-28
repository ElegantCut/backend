import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PortabarberoRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.portafolios.findMany({
      include: {
        usuarios: {
          select: { prim_nombre: true, apellido1: true, id_usuario: true },
        },
      },
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.portafolios.findFirst({
      where: { id_usuario: userId },
      include: {
        usuarios: {
          select: { prim_nombre: true, apellido1: true },
        },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.portafolios.findUnique({
      where: { id_portafolio: id },
    });
  }

  async create(data: any) {
    return this.prisma.portafolios.create({
      data,
    });
  }

  async update(id: number, data: any) {
    return this.prisma.portafolios.update({
      where: { id_portafolio: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.portafolios.delete({
      where: { id_portafolio: id },
    });
  }
}
