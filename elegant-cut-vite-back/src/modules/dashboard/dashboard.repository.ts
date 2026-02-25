import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';

@Injectable()
export class DashboardRepository {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async getSummaryStats() {
        const [stats]: any = await this.pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM reservas WHERE DATE(fecha) = CURRENT_DATE()) as citasHoy,
        (SELECT COUNT(*) FROM reservas WHERE id_estado_cita = 1) as citasPendientes,
        (SELECT COUNT(*) FROM usuarios WHERE id_rol = 3 AND DATE(created_at) = CURRENT_DATE()) as clientesNuevos
    `);
        return stats[0];
    }

    async getRecentActivity() {
        const [rows]: any = await this.pool.execute(`
      SELECT r.id_reservas, r.fecha, CONCAT(u.prim_nombre, ' ', u.apellido1) as cliente, r.id_estado_cita
      FROM reservas r
      JOIN usuarios u ON r.id_usuario = u.id_usuario
      ORDER BY r.created_at DESC
      LIMIT 10
    `);
        return rows;
    }
}
