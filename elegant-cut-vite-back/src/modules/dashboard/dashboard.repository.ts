import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardRepository {
  constructor(private prisma: PrismaService) { }

  async getSummaryStats() {
    try {
      // Calcular el día actual en Bogotá (UTC-5) y construir los rangos adecuados
      const nowBogota = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
      const yyyy = nowBogota.getFullYear();
      const mm = String(nowBogota.getMonth() + 1).padStart(2, '0');
      const dd = String(nowBogota.getDate()).padStart(2, '0');

      // Límites en UTC para reservas (que se guardan a las 00:00:00 UTC de la fecha elegida)
      const todayUtc = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);
      const tomorrowUtc = new Date(todayUtc);
      tomorrowUtc.setDate(todayUtc.getDate() + 1);

      // Límites locales convertidos a UTC para campos con marca de tiempo real (como created_at)
      // Bogotá está a UTC-5, por lo que el día inicia a las 05:00:00 UTC
      const todayLocal = new Date(`${yyyy}-${mm}-${dd}T05:00:00.000Z`);
      const tomorrowLocal = new Date(todayLocal);
      tomorrowLocal.setDate(todayLocal.getDate() + 1);

      const [
        citasHoyCount,
        citasPendientesCount,
        citasCompletadasCount,
        citasCanceladasCount,
        clientesNuevosCount,
        reservasCompletadasHoy,
      ] = await Promise.all([
        this.prisma.reservas.count({
          where: { fecha: { gte: todayUtc, lt: tomorrowUtc } },
        }),
        this.prisma.reservas.count({ where: { id_estado_cita: 1 } }),
        this.prisma.reservas.count({ where: { id_estado_cita: 2 } }),
        this.prisma.reservas.count({ where: { id_estado_cita: 3 } }),
        this.prisma.usuarios.count({
          where: { id_rol: 2, created_at: { gte: todayLocal, lt: tomorrowLocal } },
        }),
        this.prisma.reservas.findMany({
          where: {
            fecha: { gte: todayUtc, lt: tomorrowUtc },
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
