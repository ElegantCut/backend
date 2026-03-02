import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearUsuarioDto } from './dto/create-users.dto';

@Injectable()
export class UsersService {
    // UN SOLO CONSTRUCTOR: Inyecta ambas dependencias aquí
    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly prisma: PrismaService
    ) { }

    async findOneByUsername(username: string) {
        const user = await this.usersRepo.findByUsername(username);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    async updateProfilePhoto(userId: number, filename: string) {
        const photoPath = `profiles/${filename}`;
        const updated = await this.usersRepo.updateProfilePhoto(userId, photoPath);
        if (!updated) throw new Error('No se pudo actualizar la foto de perfil');
        return { photoUrl: photoPath };
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    // MÉTODOS DE PRISMA
    async obtenerTodos() {
        return this.prisma.usuarios.findMany();
    }

    // Método para crear usuario
    async crearUsuario(data: CrearUsuarioDto) {
        return await this.prisma.usuarios.create({
            data,
        });
    }


}