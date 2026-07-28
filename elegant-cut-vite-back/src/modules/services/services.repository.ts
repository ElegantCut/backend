import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearServicioDto } from './dto/create-servicio.dto';

@Injectable()
export class ServicesRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.servicios.findMany({
      orderBy: { nombre: 'asc' },
      include: { categorias: true },
    });
  }

  async findAllAdmin() {
    return this.prisma.servicios.findMany({
      orderBy: { id_servicio: 'desc' },
    });
  }

  async findAllCategories() {
    return this.prisma.categorias.findMany({
      include: { genero_servicio: true },
      orderBy: { nombre: 'asc' },
    });
  }

  async findByGender(generoId: number) {
    const categorias = await this.prisma.categorias.findMany({
      where: { id_genero: generoId } as any,
    });
    const categoryIds = categorias.map((c) => c.id_categoria);

    return this.prisma.servicios.findMany({
      where: {
        id_categoria: {
          in: categoryIds,
        },
      },
      include: { categorias: true },
    });
  }

  async findById(id: number) {
    return this.prisma.servicios.findUnique({
      where: { id_servicio: id },
      include: { categorias: true },
    });
  }

  async create(data: any) {
    const { nombre_servicio, precio, duracion } = data;
    const result = await this.prisma.servicios.create({
      data: {
        nombre: nombre_servicio,
        precio,
        duracion,
      },
    });
    return result.id_servicio;
  }

  async crearServicio(dato: CrearServicioDto) {
    return await this.prisma.servicios.create({
      data: dato,
    });
  }

  async update(id: number, data: any) {
    return await this.prisma.servicios.update({
      where: { id_servicio: id },
      data,
    });
  }

  async remove(id: number) {
    return await this.prisma.servicios.delete({
      where: { id_servicio: id },
    });
  }
}
