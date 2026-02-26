import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BarbersRepository {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.usuarios.findMany({
            where: { id_rol: 2 },
            include: { _count: { select: { reservas: true } } },
            orderBy: { created_at: 'desc' },
        });
    }

    async findActive() {
        return this.prisma.usuarios.findMany({
            where: { id_rol: 2, estado: true },
            select: {
                id_usuario: true,
                prim_nombre: true,
                seg_nombre: true,
                apellido1: true,
                apellido2: true,
                foto_perfil: true,
            },
            orderBy: { prim_nombre: 'asc' },
        });
    }

    async findById(id: number) {
        return this.prisma.usuarios.findFirst({
            where: { id_usuario: id, id_rol: 2 },
        });
    }

    async getStats(id: number) {
        // Nota: reservas no tiene id_empleado en el schema actual.
        // Cuando se agregue la columna, usar: where: { id_empleado: id }
        const total = await this.prisma.reservas.count();
        const completadas = await this.prisma.reservas.count({
            where: { id_estado_cita: 2 },
        });
        return { total_citas: total, citas_completadas: completadas };
    }
}
