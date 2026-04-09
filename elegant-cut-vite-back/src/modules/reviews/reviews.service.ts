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
        const review = await this.reviewsRepo.create(data);
        
        // Si la reseña se crea con estado aprobado (1) y tiene barbero, actualizamos su rating
        if (review && review.estado === 1 && review.id_barbero) {
            await this.updateBarberRating(review.id_barbero);
        }
        
        return review;
    }

    private async updateBarberRating(idBarbero: number) {
        try {
            // 1. Obtener todas las reseñas aprobadas para este barbero
            const reviews = await this.prisma.resenas.findMany({
                where: { 
                    id_barbero: idBarbero,
                    estado: 1 // Solo las aprobadas cuentan
                }
            });

            if (reviews.length === 0) return;

            // 2. Calcular el promedio
            const totalRating = reviews.reduce((acc, rev) => acc + rev.calificacion, 0);
            const average = totalRating / reviews.length;
            const roundedAverage = Math.round(average * 10) / 10; // Redondear a 1 decimal

            // 3. Actualizar la tabla portafolios
            const portafolio = await this.prisma.portafolios.findFirst({
                where: { id_usuario: idBarbero }
            });

            if (portafolio) {
                await this.prisma.portafolios.update({
                    where: { id_portafolio: portafolio.id_portafolio },
                    data: {
                        calificacion: roundedAverage,
                        rese_as_count: reviews.length
                    }
                });
            } else {
                // Crear portafolio si no existe (aunque debería existir)
                await this.prisma.portafolios.create({
                    data: {
                        id_usuario: idBarbero,
                        calificacion: roundedAverage,
                        rese_as_count: reviews.length
                    }
                });
            }
        } catch (error) {
            console.error('Error updating barber rating:', error);
        }
    }

    //Este es de prisma RECORDAR

    async obtenerResenas() {
        return this.prisma.resenas.findMany({ 
            where: { estado: 1 },
            orderBy: { fecha_resena: 'desc' }, 
            include: {
                barbero: {
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
        const review = await this.prisma.resenas.update({
            where: { id_resena: id },
            data: { estado: nuevoEstado }
        });

        // Al cambiar el estado, recalculamos el rating del barbero
        if (review.id_barbero) {
            await this.updateBarberRating(review.id_barbero);
        }

        return { success: true };
    }

    async deleteAdmin(id: number) {
        const review = await this.prisma.resenas.findUnique({
            where: { id_resena: id }
        });

        await this.prisma.resenas.delete({
            where: { id_resena: id }
        });

        // Si borramos una reseña, recalculamos el rating
        if (review && review.id_barbero) {
            await this.updateBarberRating(review.id_barbero);
        }

        return { success: true };
    }

    async findBarberReviews(idBarbero: number) {
        return this.prisma.resenas.findMany({
            where: {
                id_barbero: (idBarbero && !isNaN(Number(idBarbero))) ? Number(idBarbero) : null,
                estado: 1
            },
            orderBy: { fecha_resena: 'desc' },
            take: 10 // Mostrar solo los últimos 10
        });
    }
}
