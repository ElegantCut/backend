import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentsRepository {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.reservas.findMany({
            orderBy: { fecha: 'desc' },
            select: {
                id_reservas: true,
                fecha: true,
                observaciones: true,
                id_estado_cita: true,
                usuarios: {
                    select: { prim_nombre: true, apellido1: true },
                },
                horarios: {
                    select: { hora_inicio: true },
                },
            },
        });
    }

    async getAvailableSlots(date: string, barberId: number) {
        const targetDate = new Date(date);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const [allSlots, occupied] = await Promise.all([
            this.prisma.horarios.findMany({
                orderBy: { hora_inicio: 'asc' },
            }),
            this.prisma.reservas.findMany({
                where: {
                    fecha: { gte: targetDate, lt: nextDay },
                    id_estado_cita: { in: [1, 2] },
                },
                select: { horarios: { select: { hora_inicio: true } } },
            }),
        ]);

        const occupiedTimes = new Set(
            occupied.map((r) => r.horarios?.hora_inicio),
        );

        return allSlots.map((slot) => ({
            id: slot.id_horarios,
            time: slot.hora_inicio.toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2'),
            isAvailable: !occupiedTimes.has(slot.hora_inicio),
        }));
    }

    async create(appointmentData: any) {
        const { userId, date, notes, idHorarios, serviceId } = appointmentData;

        return this.prisma.$transaction(async (tx) => {
            const reserva = await tx.reservas.create({
                data: {
                    fecha: new Date(date),
                    observaciones: notes || '',
                    id_usuario: userId,
                    id_estado_cita: 1,
                    id_horarios: idHorarios,
                    // Nota: id_empleado no existe en el schema actual.
                    // Agregar la columna en MySQL y regenerar con: npx prisma db pull && npx prisma generate
                },
            });

            await tx.detalle_cita_servicio.create({
                data: {
                    id_reservas: reserva.id_reservas,
                    id_servicio: serviceId,
                },
            });

            return reserva.id_reservas;
        });
    }
}
