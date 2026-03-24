import { Injectable, NotFoundException } from '@nestjs/common';
import { BarbersRepository } from './barbers.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateBarberDto } from './dto/create.barbers.dto';

@Injectable()
export class BarbersService {
    constructor(private readonly barbersRepo: BarbersRepository, private readonly prisma: PrismaService) { }

    async getAllBarbers() {
        return this.barbersRepo.findAll();
    }

    async getPublicBarbers() {
        return this.barbersRepo.findActive();
    }

    async getBarberStats(id: number) {
        const stats = await this.barbersRepo.getStats(id);

        if (!stats) {
            throw new NotFoundException(`No se encontraron estadísticas para el barbero con ID ${id}`);
        }

        return stats;
    }

    // obtener los barberos llamando la lógica de ts
    async obtenerBarberos() {
        const barberos = await this.prisma.usuarios.findMany({
            where: {
                id_rol: 3,
            }
        });

        if (!barberos || barberos.length === 0) {
            throw new NotFoundException('No se encontraron barberos registrados');
        }

        return barberos;
    }

    // crear un nuevo barber
    async crearBarbero(createBarberDto: CreateBarberDto) {
    // Encriptar la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createBarberDto.password_hash, salt);

    // Crear el usuario con id_rol = 3 (que es el rol de Barbero)
    const nuevoBarbero = await this.prisma.usuarios.create({
        data: {
            prim_nombre: createBarberDto.prim_nombre,
            seg_nombre: createBarberDto.seg_nombre,
            apellido1: createBarberDto.apellido1,
            apellido2: createBarberDto.apellido2,
            email: createBarberDto.email,
            username: createBarberDto.username,
            telefono: createBarberDto.telefono,
            password_hash: hashedPassword, // Guardamos la encriptada
            id_rol: 3,
            estado: true,
        },
    });

    // Retornamos sin mostrar la contraseña por seguridad
    const { password_hash, ...result } = nuevoBarbero;
    return result;
}

    // --- NUEVOS MÉTODOS PARA EL CRUD DEL ADMIN ---

    async findOne(id: number) {
        const barbero = await this.prisma.usuarios.findFirst({
            where: { id_usuario: id, id_rol: 3 },
            include: {
                portafolios: true,
                barberos_servicios: {
                    include: { servicios: true }
                }
            }
        });

        if (!barbero) throw new Error(`Barbero con ID ${id} no encontrado`);
        
        const { password_hash, ...result } = barbero;
        return result;
    }

    async update(id: number, data: any) {
        await this.findOne(id); // Verifica si existe
        
        if (data.password_hash) {
            const salt = await bcrypt.genSalt(10);
            data.password_hash = await bcrypt.hash(data.password_hash, salt);
        }

        const actualizado = await this.prisma.usuarios.update({
            where: { id_usuario: id, id_rol: 3 },
            data,
        });

        const { password_hash, ...result } = actualizado;
        return result;
    }

    async remove(id: number) {
        await this.findOne(id); // Verifica si existe
        
        // Soft delete
        return await this.prisma.usuarios.update({
            where: { id_usuario: id, id_rol: 3 },
            data: { estado: false },
        });
    }

}
