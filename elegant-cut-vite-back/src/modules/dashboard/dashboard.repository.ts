import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private prisma: PrismaService) {}

  async getSummaryStats() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [
        citasHoyCount,
        citasPendientesCount,
        citasCompletadasCount,
        citasCanceladasCount,
        clientesNuevosCount,
        citasCompletadasHoy,
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
            id_estado_cita: 2, // Completada
            fecha: { gte: today, lt: tomorrow },
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

      // Calcular ingresos de hoy (suma de precios de servicios de citas completadas hoy)
      const ingresosHoy = citasCompletadasHoy.reduce((total, reserva) => {
        const precioServicios = reserva.detalle_cita_servicio.reduce((subTotal, detalle) => {
          return subTotal + (detalle.servicios ? Number(detalle.servicios.precio) : 0);
        }, 0);
        return total + precioServicios;
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
