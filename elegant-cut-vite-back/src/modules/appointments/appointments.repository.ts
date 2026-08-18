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

  async getAvailableSlots(date: string, barberId: number, newServiceDuration?: number) {
    const targetDate = new Date(date);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Duración por defecto del nuevo servicio: 30 minutos
    const newDuration = newServiceDuration || 30;

    const [allSlots, existingAppointments] = await Promise.all([
      this.prisma.horarios.findMany({
        orderBy: { hora_inicio: 'asc' },
      }),
      this.prisma.reservas.findMany({
        where: {
          fecha: { gte: targetDate, lt: nextDay },
          id_empleado: barberId,
          id_estado_cita: { in: [1, 2] },
        },
        select: {
          horarios: { select: { hora_inicio: true } },
          detalle_cita_servicio: {
            select: { servicios: { select: { duracion: true } } },
          },
        },
      }),
    ]);

    // Helper: convertir hora numérica (ej. 1700) a minutos desde medianoche (ej. 1020)
    const toMinutes = (h: number): number => {
      const str = h.toString().padStart(4, '0');
      return parseInt(str.slice(0, 2)) * 60 + parseInt(str.slice(2, 4));
    };

    // Construir rangos ocupados: [startMinutes, endMinutes] para cada cita existente
    const occupiedRanges: { start: number; end: number }[] = existingAppointments.map((r) => {
      const startMin = toMinutes(r.horarios?.hora_inicio || 0);
      const svcDuration = r.detalle_cita_servicio?.[0]?.servicios?.duracion || 30;
      return { start: startMin, end: startMin + svcDuration };
    });

    // Para cada slot, verificar si agendar el nuevo servicio ahí se solapa con alguna cita existente
    return allSlots.map((slot) => {
      const candidateStart = toMinutes(slot.hora_inicio);
      const candidateEnd = candidateStart + newDuration;

      // Hay solapamiento si: candidateStart < existingEnd AND candidateEnd > existingStart
      const hasOverlap = occupiedRanges.some(
        (range) => candidateStart < range.end && candidateEnd > range.start,
      );

      return {
        id: slot.id_horarios,
        time: slot.hora_inicio.toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2'),
        isAvailable: !hasOverlap,
      };
    });
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

  async findAppointmentsByBarber(barberId: number, date?: string) {
    const whereClause: any = {
      id_empleado: barberId,
    };

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);

      whereClause.fecha = {
        gte: targetDate,
        lt: nextDay,
      };
    }

    return this.prisma.reservas.findMany({
      where: whereClause,
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

  async createAppointmentWithTransaction(reservaData: any, id_servicio: number) {
    return this.prisma.$transaction(async (tx) => {
      // Helper: convertir hora numérica (ej. 1700) a minutos desde medianoche
      const toMinutes = (h: number): number => {
        const str = h.toString().padStart(4, '0');
        return parseInt(str.slice(0, 2)) * 60 + parseInt(str.slice(2, 4));
      };

      const fechaDate = new Date(reservaData.fecha);
      const nextDay = new Date(fechaDate);
      nextDay.setDate(nextDay.getDate() + 1);

      // Obtener la duración del nuevo servicio
      const newService = await tx.servicios.findUnique({
        where: { id_servicio },
        select: { duracion: true },
      });
      const newDuration = newService?.duracion || 30;

      // Obtener el horario del nuevo slot
      const newSlot = await tx.horarios.findUnique({
        where: { id_horarios: reservaData.id_horarios },
        select: { hora_inicio: true },
      });
      const newStart = toMinutes(newSlot?.hora_inicio || 0);
      const newEnd = newStart + newDuration;

      // Obtener todas las citas existentes del barbero en ese día
      const existingAppointments = await tx.reservas.findMany({
        where: {
          id_empleado: reservaData.id_empleado,
          fecha: { gte: fechaDate, lt: nextDay },
          id_estado_cita: { in: [1, 2] },
        },
        select: {
          horarios: { select: { hora_inicio: true } },
          detalle_cita_servicio: {
            select: { servicios: { select: { duracion: true } } },
          },
        },
      });

      // Verificar si hay solapamiento con alguna cita existente
      const hasOverlap = existingAppointments.some((r) => {
        const existingStart = toMinutes(r.horarios?.hora_inicio || 0);
        const existingDuration = r.detalle_cita_servicio?.[0]?.servicios?.duracion || 30;
        const existingEnd = existingStart + existingDuration;
        return newStart < existingEnd && newEnd > existingStart;
      });

      if (hasOverlap) {
        throw new Error('HORARIO_OCUPADO');
      }

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
