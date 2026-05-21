import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServiceUService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.servicios.create({ data });
  }

  async findAll() {
    return this.prisma.servicios.findMany();
  }

  async update(id: number, data: any) {
    return this.prisma.servicios.update({
      where: { id_servicio: id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.servicios.delete({
      where: { id_servicio: id },
    });
  }
}
