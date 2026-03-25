import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
    constructor(private prisma: PrismaService) { }

    async getSummaryStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [citasHoy, citasPendientes, clientesNuevos] = await Promise.all([
            this.prisma.reservas.count({
                where: { fecha: { gte: today, lt: tomorrow } },
            }),
            this.prisma.reservas.count({
                where: { id_estado_cita: 1 },
            }),
            this.prisma.usuarios.count({
                where: {
                    id_rol: 3,
                    created_at: { gte: today, lt: tomorrow },
                },
            }),
        ]);

        return { citasHoy, citasPendientes, clientesNuevos };
    }

    async getRecentActivity() {
        return this.prisma.reservas.findMany({
            take: 10,
            orderBy: { fecha: 'desc' },
            select: {
                id_reservas: true,
                fecha: true,
                id_estado_cita: true,
                usuarios: {
                    select: { prim_nombre: true, apellido1: true },
                },
            },
        });
    }
}
