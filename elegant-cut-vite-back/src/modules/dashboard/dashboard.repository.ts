import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private prisma: PrismaService) { }

  async getSummaryStats(startDateStr?: string, endDateStr?: string) {
    try {
      let startDate: Date;
      let endDate: Date;

      if (startDateStr && endDateStr) {
        startDate = new Date(startDateStr);
        endDate = new Date(endDateStr);
      } else {
        // Forzar que el cálculo de fecha sea con respecto a la zona horaria de Colombia (UTC-5)
        const now = new Date();
        const cotNow = new Date(now.getTime() - 5 * 60 * 60 * 1000);

        const cotStart = new Date(cotNow);
        cotStart.setUTCHours(0, 0, 0, 0);

        startDate = new Date(cotStart.getTime() + 5 * 60 * 60 * 1000);
        endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
      }

      const dateFilter = { gte: startDate, lt: endDate };

      const [
        citasHoyCount,
        citasPendientesCount,
        citasCompletadasCount,
        citasCanceladasCount,
        clientesNuevosCount,
        reservasCompletadasHoy,
      ] = await Promise.all([
        this.prisma.reservas.count({
          where: { fecha: dateFilter },
        }),
        this.prisma.reservas.count({ where: { id_estado_cita: 1, fecha: dateFilter } }),
        this.prisma.reservas.count({ where: { id_estado_cita: 2, fecha: dateFilter } }),
        this.prisma.reservas.count({ where: { id_estado_cita: 3, fecha: dateFilter } }),
        this.prisma.usuarios.count({
          where: { id_rol: 2, created_at: dateFilter },
        }),
        this.prisma.reservas.findMany({
          where: {
            id_estado_cita: 2, // Completada
            fecha: dateFilter,
          },
          include: {
            detalle_cita_servicio: {
              include: {
                servicios: true,
              },
            },
          },
        }),
      ]);

      // Calcular ingresos de hoy (suma de los precios de servicios en citas completadas hoy)
      const ingresosHoy = (reservasCompletadasHoy || []).reduce((total, reserva) => {
        const precioReserva = (reserva.detalle_cita_servicio || []).reduce((subtotal, detalle) => {
          return subtotal + (detalle.servicios ? Number(detalle.servicios.precio) : 0);
        }, 0);
        return total + precioReserva;
      }, 0);

      return {
        success: true,
        data: {
          citasHoy: citasHoyCount,
          ingresosHoy,
          clientesNuevos: clientesNuevosCount,
          citasPendientes: citasPendientesCount,
          citasCompletadas: citasCompletadasCount,
          citasCanceladas: citasCanceladasCount,
        },
      };
    } catch (error) {
      console.error(
        'Dashboard Stats Error:',
        Date.now() /* avoid minification */,
        error,
      );
      return {
        success: false,
        data: {
          citasHoy: 0,
          ingresosHoy: 0,
          clientesNuevos: 0,
          citasPendientes: 0,
          citasCompletadas: 0,
          citasCanceladas: 0,
        },
      };
    }
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
