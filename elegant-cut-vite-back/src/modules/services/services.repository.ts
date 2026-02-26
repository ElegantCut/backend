import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicesRepository {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        // En el schema el campo es 'nombre', no 'nombre_servicio'
        return this.prisma.servicios.findMany({
            orderBy: { nombre: 'asc' },
        });
    }

    async findById(id: number) {
        return this.prisma.servicios.findFirst({
            where: { id_servicio: id },
        });
    }

    async create(data: any) {
        const { nombre_servicio, precio, duracion } = data;
        const result = await this.prisma.servicios.create({
            data: {
                nombre: nombre_servicio, // el campo en la tabla se llama 'nombre'
                precio,
                duracion,
            },
        });
        return result.id_servicio;
    }
}
