import { Injectable, Inject } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class PqrsRepository {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async create(data: any) {
        const { requestType, userName, userId, userEmail, userPhone, subject, description, responseMedium } = data;
        const [result] = await this.pool.execute<ResultSetHeader>(
            `INSERT INTO pqrs 
       (tipo_solicitud, nombre_completo, identificacion, email, telefono, asunto, descripcion, medio_respuesta) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [requestType, userName, userId, userEmail, userPhone, subject, description, responseMedium],
        );
        return result.insertId;
    }

    async findByUserData(email: string, phone: string) {
        const [rows]: any = await this.pool.execute(
            `SELECT id_pqrs, tipo_solicitud, asunto, fecha_creacion, estado 
       FROM pqrs 
       WHERE email = ? OR telefono = ? 
       ORDER BY fecha_creacion DESC`,
            [email, phone],
        );
        return rows;
    }
}
