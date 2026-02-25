import { Injectable, Inject } from '@nestjs/common';
import { Pool, ResultSetHeader, PoolConnection } from 'mysql2/promise';

@Injectable()
export class AppointmentsRepository {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const [rows]: any = await this.pool.execute(
            `SELECT r.id_reservas, r.fecha, r.observaciones, r.id_estado_cita,
              CONCAT(u.prim_nombre, ' ', u.apellido1) as cliente,
              COALESCE(h.hora_inicio, 0) as hora_inicio
       FROM reservas r
       LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
       LEFT JOIN horarios h ON r.id_horarios = h.id_horarios
       ORDER BY r.fecha DESC`,
        );
        return rows;
    }

    async getAvailableSlots(date: string, barberId: number) {
        const [allSlots]: any = await this.pool.execute(
            'SELECT id_horarios, hora_inicio FROM horarios ORDER BY hora_inicio ASC',
        );

        const [occupied]: any = await this.pool.execute(
            `SELECT h.hora_inicio 
       FROM reservas r
       JOIN horarios h ON r.id_horarios = h.id_horarios
       WHERE r.fecha = ? AND r.id_empleado = ? AND r.id_estado_cita IN (1, 2)`,
            [date, barberId],
        );

        const occupiedTimes = new Set(occupied.map((o: any) => o.hora_inicio));

        return allSlots.map((slot: any) => ({
            id: slot.id_horarios,
            time: slot.hora_inicio.toString().padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2'),
            isAvailable: !occupiedTimes.has(slot.hora_inicio),
        }));
    }

    async create(appointmentData: any) {
        const connection = await this.pool.getConnection();
        try {
            await connection.beginTransaction();
            const { userId, date, notes, idHorarios, barberId, serviceId } = appointmentData;

            const [reservaResult] = await connection.execute<ResultSetHeader>(
                `INSERT INTO reservas (fecha, observaciones, id_usuario, id_estado_cita, id_horarios, id_empleado) 
         VALUES (?, ?, ?, 1, ?, ?)`,
                [date, notes || '', userId, idHorarios, barberId],
            );

            const reservaId = reservaResult.insertId;
            await connection.execute(
                'INSERT INTO detalle_cita_servicio (id_reservas, id_servicio) VALUES (?, ?)',
                [reservaId, serviceId],
            );

            await connection.commit();
            return reservaId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}
