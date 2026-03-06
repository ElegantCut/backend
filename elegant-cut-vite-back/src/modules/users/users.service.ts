import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearUsuarioDto } from './dto/create-users.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly prisma: PrismaService
    ) { }

    async findOneByUsername(username: string) {
        const user = await this.usersRepo.findByUsername(username);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    /**
     * ACTUALIZAR FOTO CON CLOUDINARY
     * Este método reemplaza la lógica local por la de la nube.
     */
    async updatePhoto(id_usuario: number, public_id: string) {
        // 1. Verificamos que el usuario exista en la tabla SQL
        const usuario = await this.prisma.usuarios.findUnique({
            where: { id_usuario },
        });

        if (!usuario) {
            throw new NotFoundException(`El usuario con ID ${id_usuario} no fue encontrado.`);
        }

        // 2. Actualizamos la columna foto_perfil con el ID de Cloudinary
        return await this.prisma.usuarios.update({
            where: { id_usuario },
            data: {
                foto_perfil: public_id
            },
        });
    }

    // MÉTODOS DE PRISMA EXISTENTES
    async obtenerTodos() {
        return this.prisma.usuarios.findMany();
    }

    async crearUsuario(data: CrearUsuarioDto) {
        return await this.prisma.usuarios.create({
            data,
        });
    }
}