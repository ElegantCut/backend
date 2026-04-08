import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsRepository {
    constructor(private prisma: PrismaService) { }

    async findAllApproved() {
        return this.prisma.resenas.findMany({
            where: { estado: 1 },
            include: {
                barbero: {
                    select: {
                        prim_nombre: true,
                        apellido1: true
                    }
                }
            },
            orderBy: { fecha_resena: 'desc' },
        });
    }

    async create(data: any) {
        console.log('REPOSITORY: Intentando crear reseña con data:', data);
        const { nombre_cliente, email_cliente, calificacion, comentario, id_barbero } = data;
        const result = await this.prisma.resenas.create({
            data: { 
                nombre_cliente, 
                email_cliente, 
                calificacion: Number(calificacion), 
                comentario,
                id_barbero: (id_barbero && !isNaN(Number(id_barbero))) ? Number(id_barbero) : null,
                estado: 1 // Forzamos estado activo para que sea visible de inmediato
            },
        });
        return result;
    }
}
