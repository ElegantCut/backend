import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsRepository {
    constructor(private prisma: PrismaService) { }

    async findAllApproved() {
        return this.prisma.resenas.findMany({
            where: { estado: 1 },
            orderBy: { fecha_resena: 'desc' },
            include: {
                barbero: {
                    select: {
                        id_usuario: true,
                        prim_nombre: true,
                        apellido1: true
                    }
                },
                usuarios_resenas_id_clienteTousuarios: {
                    select: {
                        prim_nombre: true
                    }
                }
            }
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
                estado: 1
            },
        });
        return result;
    }
}
