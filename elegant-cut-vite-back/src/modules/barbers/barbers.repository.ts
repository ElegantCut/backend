import { Injectable, Inject } from '@nestjs/common';
import { Pool, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class BarbersRepository {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const [rows]: any = await this.pool.execute(
            `SELECT u.id_usuario, u.username, u.prim_nombre, u.seg_nombre, u.apellido1, u.apellido2, u.email, u.telefono, u.estado, u.created_at,
              COUNT(r.id_reservas) as total_citas
       FROM usuarios u
       LEFT JOIN reservas r ON u.id_usuario = r.id_usuario
       WHERE u.id_rol = 2
       GROUP BY u.id_usuario
       ORDER BY u.created_at DESC`,
        );
        return rows;
    }

    async findActive() {
        const [rows]: any = await this.pool.execute(
            `SELECT id_usuario, prim_nombre, seg_nombre, apellido1, apellido2, foto_perfil
       FROM usuarios 
       WHERE id_rol = 2 AND estado = 1
       ORDER BY prim_nombre`,
        );
        return rows;
    }

    async findById(id: number) {
        const [rows]: any = await this.pool.execute(
            'SELECT * FROM usuarios WHERE id_usuario = ? AND id_rol = 2',
            [id],
        );
        return rows[0];
    }

    // Otros métodos de estadísticas y gestión...
    async getStats(id: number) {
        const [stats]: any = await this.pool.execute(
            `SELECT COUNT(r.id_reservas) as total_citas,
              COUNT(CASE WHEN r.id_estado_cita = 2 THEN 1 END) as citas_completadas
       FROM reservas r
       WHERE r.id_empleado = ?`,
            [id],
        );
        return stats[0];
    }
}
