import { Injectable, Inject } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class ServicesRepository {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAll() {
        const [rows]: any = await this.pool.execute(
            'SELECT * FROM servicios ORDER BY nombre_servicio',
        );
        return rows;
    }

    async findById(id: number) {
        const [rows]: any = await this.pool.execute(
            'SELECT * FROM servicios WHERE id_servicio = ?',
            [id],
        );
        return rows[0];
    }

    async create(data: any) {
        const { nombre_servicio, precio, duracion } = data;
        const [result] = await this.pool.execute<ResultSetHeader>(
            'INSERT INTO servicios (nombre_servicio, precio, duracion) VALUES (?, ?, ?)',
            [nombre_servicio, precio, duracion],
        );
        return result.insertId;
    }
}
