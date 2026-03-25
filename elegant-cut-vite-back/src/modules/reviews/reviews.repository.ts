import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsRepository {
    constructor(private prisma: PrismaService) { }

    async findAllApproved() {
        // FIXME: La tabla 'resenas' ya no existe en la base de datos tras la actualización.
        // return this.prisma.resenas.findMany({
        //     where: { estado: 1 },
        //     orderBy: { fecha_resena: 'desc' },
        // });
        return [];
    }

    async create(data: any) {
        // FIXME: La tabla 'resenas' ya no existe en la base de datos tras la actualización.
        // const { nombre_cliente, email_cliente, calificacion, comentario } = data;
        // const result = await this.prisma.resenas.create({
        //     data: { nombre_cliente, email_cliente, calificacion, comentario },
        // });
        // return result.id_resena;
        return null;
    }
}
