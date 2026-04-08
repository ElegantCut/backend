import { Injectable } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private readonly reviewsRepo: ReviewsRepository, private readonly prisma: PrismaService) { }

    async findApproved() {
        return this.reviewsRepo.findAllApproved();
    }

    async create(data: any) {
        return this.reviewsRepo.create(data);
    }

    //Este es de prisma RECORDAR

    async obtenerResenas() {
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
                        prim_nombre: true,
                        apellido1: true
                    }
                }
            }
        });
    }

    async findAllAdmin(status?: string) {
        const where: any = {};
        if (status === 'approved') where.estado = 1;
        if (status === 'spam') where.estado = 0;

        return this.prisma.resenas.findMany({
            where,
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
                        username: true,
                        prim_nombre: true,
                        apellido1: true,
                        email: true
                    }
                }
            }
        });
    }

    async changeStatusAdmin(id: number, nuevoEstado: number) {
        await this.prisma.resenas.update({
            where: { id_resena: id },
            data: { estado: nuevoEstado }
        });
        return { success: true };
    }

    async deleteAdmin(id: number) {
        await this.prisma.resenas.delete({
            where: { id_resena: id }
        });
        return { success: true };
    }
}
