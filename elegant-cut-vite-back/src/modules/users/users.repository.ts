import { Injectable, Inject } from '@nestjs/common';
import type { Pool, ResultSetHeader } from 'mysql2/promise';

@Injectable()
export class UsersRepository {
    constructor(@Inject('DATABASE_POOL') private pool: Pool) { }

    async findByUsername(username: string) {
        const [rows]: any = await this.pool.execute(
            `SELECT u.*, r.nombre_rol as role 
       FROM usuarios u 
       LEFT JOIN rol r ON u.id_rol = r.id_rol 
       WHERE u.username = ? AND u.estado = 1`,
            [username],
        );
        return rows[0];
    }

    async findByEmail(email: string) {
        const [rows]: any = await this.pool.execute(
            'SELECT * FROM usuarios WHERE email = ? AND estado = 1',
            [email],
        );
        return rows[0];
    }

    async findById(id: number) {
        const [rows]: any = await this.pool.execute(
            `SELECT u.*, r.nombre_rol as role 
       FROM usuarios u 
       LEFT JOIN rol r ON u.id_rol = r.id_rol 
       WHERE u.id_usuario = ? AND u.estado = 1`,
            [id],
        );
        return rows[0];
    }

    async create(userData: any, idRol: number, hashedPassword: string) {
        const { username, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono } = userData;
        const [result] = await this.pool.execute<ResultSetHeader>(
            `INSERT INTO usuarios(username, password_hash, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, id_rol, estado)
       VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
            [username, hashedPassword, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono, idRol],
        );
        return result.insertId;
    }

    async updatePassword(identifier: string, hashedPassword: string, isEmail = false) {
        const field = isEmail ? 'email' : 'username';
        const [result] = await this.pool.execute<ResultSetHeader>(
            `UPDATE usuarios SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE ${field} = ?`,
            [hashedPassword, identifier],
        );
        return result.affectedRows > 0;
    }

    async updateProfilePhoto(userId: number, photoPath: string) {
        const [result] = await this.pool.execute<ResultSetHeader>(
            'UPDATE usuarios SET foto_perfil = ? WHERE id_usuario = ?',
            [photoPath, userId],
        );
        return result.affectedRows > 0;
    }

    async findRoleIdByName(roleName: string): Promise<number | null> {
        const [rows]: any = await this.pool.execute(
            'SELECT id_rol FROM rol WHERE nombre_rol = ?',
            [roleName],
        );
        if (rows.length > 0) return rows[0].id_rol;

        // Fallback para 'administrador'
        if (roleName.toLowerCase() === 'administrador') {
            const [rowsFallback]: any = await this.pool.execute(
                "SELECT id_rol FROM rol WHERE nombre_rol LIKE '%Admin%' OR nombre_rol LIKE '%admin%'",
            );
            if (rowsFallback.length > 0) return rowsFallback[0].id_rol;
        }
        return null;
    }
}
