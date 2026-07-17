import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentsRepository {
  constructor(private prisma: PrismaService) {}

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

    const occupiedTimes = new Set(occupied.map((r) => r.horarios?.hora_inicio));

    return allSlots.map((slot) => ({
      id: slot.id_horarios,
      time: slot.hora_inicio
        .toString()
        .padStart(4, '0')
        .replace(/(\d{2})(\d{2})/, '$1:$2'),
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

  // --- NUEVOS MÉTODOS DE REPOSITORIO PARA CUMPLIR CON SOLID ---

  async findAllWithDetails() {
    return this.prisma.reservas.findMany({
      include: {
        usuarios: true,
        horarios: true,
        detalle_cita_servicio: {
          include: { servicios: true },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async updateAppointmentStatus(id: number, nuevoEstado: number) {
    return this.prisma.reservas.update({
      where: { id_reservas: id },
      data: { id_estado_cita: nuevoEstado },
    });
  }

  async findAppointmentsByBarber(barberId: number) {
    return this.prisma.reservas.findMany({
      where: {
        id_empleado: barberId,
      },
      include: {
        usuarios: true,
        horarios: true,
        detalle_cita_servicio: {
          include: {
            servicios: true,
          },
        },
      },
    });
  }

  async createAppointmentWithTransaction(
    reservaData: any,
    id_servicio: number,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const reservaResult = await tx.reservas.create({
        data: reservaData,
      });

      await tx.detalle_cita_servicio.create({
        data: {
          id_reservas: reservaResult.id_reservas,
          id_servicio: id_servicio,
        },
      });

      return reservaResult;
    });
  }


  async findAllHorarios() {
    return this.prisma.horarios.findMany({
      orderBy: { hora_inicio: 'asc' },
    });
  }

  async findUniqueWithDetails(id: number) {
    return this.prisma.reservas.findUnique({
      where: { id_reservas: id },
      include: {
        usuarios: {
          select: {
            prim_nombre: true,
            apellido1: true,
            telefono: true,
            email: true,
          },
        },
        estado_cita: true,
        horarios: true,
        detalle_cita_servicio: {
          include: { servicios: true },
        },
      },
    });
  }

  async findAppointmentsByUser(userId: number) {
    return this.prisma.reservas.findMany({
      where: { id_usuario: userId },
      include: {
        horarios: true,
        estado_cita: true,
        detalle_cita_servicio: {
          include: { servicios: true },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  async updateAppointment(id: number, data: any) {
    return this.prisma.reservas.update({
      where: { id_reservas: id },
      data: data,
      include: { estado_cita: true },
    });
  }

  async findTomorrowReminders(tomorrow: Date, dayAfterTomorrow: Date) {
    return this.prisma.reservas.findMany({
      where: {
        fecha: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
        id_estado_cita: 1, // Solo pendientes
      },
      include: {
        usuarios: true,
        horarios: true,
        detalle_cita_servicio: {
          include: { servicios: true },
        },
      },
    });
  }
}
