import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsRepository {
    constructor(private prisma: PrismaService) { }

    async findAllApproved() {
        return this.prisma.resenas.findMany({
            where: { estado: 1 },
            orderBy: { fecha_resena: 'desc' },
        });
    }

    async create(data: any) {
        const { nombre_cliente, email_cliente, calificacion, comentario } = data;
        const result = await this.prisma.resenas.create({
            data: { nombre_cliente, email_cliente, calificacion, comentario },
        });
        return result.id_resena;
    }
}
