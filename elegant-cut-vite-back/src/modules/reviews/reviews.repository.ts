import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReviewsRepository {
    constructor(private prisma: PrismaService) { }

    async findAllApproved() {
        return this.prisma.resenas.findMany({
            where: { estado: 1 },
<<<<<<< HEAD
            orderBy: { fecha_resena: 'desc' },
            include: {
                barbero: {
                    select: {
                        id_usuario: true,
=======
            include: {
                barbero: {
                    select: {
>>>>>>> 932e484e87f574847ae91db0035dd8d781dc9847
                        prim_nombre: true,
                        apellido1: true
                    }
                }
<<<<<<< HEAD
            }
=======
            },
            orderBy: { fecha_resena: 'desc' },
>>>>>>> 932e484e87f574847ae91db0035dd8d781dc9847
        });
    }

    async create(data: any) {
<<<<<<< HEAD
        const { calificacion, comentario, id_barbero, id_cliente } = data;
        const result = await (this.prisma.resenas as any).create({
            data: { 
                id_cliente: id_cliente ? Number(id_cliente) : null,
                calificacion: Number(calificacion), 
                comentario,
                id_barbero: id_barbero ? Number(id_barbero) : null
            },
        });
        return result.id_resena;
=======
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
>>>>>>> 932e484e87f574847ae91db0035dd8d781dc9847
    }
}
