import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicesRepository {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        // Obtenemos todos los servicios e incluimos la información de la tabla relacionada 'categorias'
        // Esto es necesario para que el frontend pueda ver el nombre de la categoría y filtrar
        return this.prisma.servicios.findMany({
            orderBy: { nombre: 'asc' },
            include: { categorias:true } // <- RELACIÓN CON LA TABLA DE CATEGORÍAS
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
