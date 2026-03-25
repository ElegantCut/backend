import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) { }

    async findByUsername(username: string) {
        return this.prisma.usuarios.findFirst({
            where: { username, estado: true },
            include: { rol: true },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.usuarios.findFirst({
            where: { email, estado: true },
        });
    }

    async findById(id: number) {
        return this.prisma.usuarios.findFirst({
            where: { id_usuario: id, estado: true },
            include: { rol: true },
        });
    }

    async create(userData: any, idRol: number, hashedPassword: string) {
        const { username, email, prim_nombre, seg_nombre, apellido1, apellido2, telefono } = userData;
        const result = await this.prisma.usuarios.create({
            data: {
                username,
                password_hash: hashedPassword,
                email,
                prim_nombre,
                seg_nombre,
                apellido1,
                apellido2,
                telefono,
                id_rol: idRol,
                estado: true,
            },
        });
        return result.id_usuario;
    }

    async updatePassword(identifier: string, hashedPassword: string, isEmail = false) {
        const where = isEmail ? { email: identifier } : { username: identifier };
        const result = await this.prisma.usuarios.updateMany({
            where,
            data: { password_hash: hashedPassword },
        });
        return result.count > 0;
    }

    async updateProfilePhoto(userId: number, photoPath: string) {
        const result = await this.prisma.usuarios.updateMany({
            where: { id_usuario: userId },
            data: { foto_perfil: photoPath },
        });
        return result.count > 0;
    }

    async findRoleIdByName(roleName: string): Promise<number | null> {
        const rol = await this.prisma.rol.findFirst({
            where: { nombre_rol: roleName },
        });
        if (rol) return rol.id_rol;

        // Fallback para 'administrador'
        if (roleName.toLowerCase() === 'administrador') {
            const rolFallback = await this.prisma.rol.findFirst({
                where: {
                    OR: [
                        { nombre_rol: { contains: 'Admin' } },
                        { nombre_rol: { contains: 'admin' } },
                    ],
                },
            });
            if (rolFallback) return rolFallback.id_rol;
        }
        return null;
    }
}
