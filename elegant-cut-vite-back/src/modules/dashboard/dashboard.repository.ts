import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private prisma: PrismaService) { }

  async getSummaryStats() {
    try {
      // Forzar que el cálculo de fecha sea con respecto a la zona horaria de Colombia (UTC-5)
      const now = new Date();
      const cotNow = new Date(now.getTime() - 5 * 60 * 60 * 1000);

      const cotStart = new Date(cotNow);
      cotStart.setUTCHours(0, 0, 0, 0);

      const today = new Date(cotStart.getTime() + 5 * 60 * 60 * 1000);
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

      const [
        citasHoyCount,
        citasPendientesCount,
        citasCompletadasCount,
        citasCanceladasCount,
        clientesNuevosCount,
        reservasCompletadasHoy,
      ] = await Promise.all([
        this.prisma.reservas.count({
          where: { fecha: { gte: today, lt: tomorrow } },
        }),
        this.prisma.reservas.count({ where: { id_estado_cita: 1 } }),
        this.prisma.reservas.count({ where: { id_estado_cita: 2 } }),
        this.prisma.reservas.count({ where: { id_estado_cita: 3 } }),
        this.prisma.usuarios.count({
          where: { id_rol: 2, created_at: { gte: today, lt: tomorrow } },
        }),
        this.prisma.reservas.findMany({
          where: {
            fecha: { gte: today, lt: tomorrow },
            id_estado_cita: 2, // 2 = Completada
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
        Math.random() /* avoid minification */,
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
