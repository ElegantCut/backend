import { Injectable, Inject } from '@nestjs/common';
import { Pool, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class ReviewsRepository {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findAllApproved() {
        const [rows]: any = await this.pool.execute(
            'SELECT * FROM resenas WHERE estado = 1 ORDER BY fecha_resena DESC',
        );
        return rows;
    }

    async create(data: any) {
        const { nombre_cliente, email_cliente, calificacion, comentario } = data;
        const [result] = await this.pool.execute<ResultSetHeader>(
            'INSERT INTO resenas (nombre_cliente, email_cliente, calificacion, comentario) VALUES (?, ?, ?, ?)',
            [nombre_cliente, email_cliente, calificacion, comentario],
        );
        return result.insertId;
    }
}
