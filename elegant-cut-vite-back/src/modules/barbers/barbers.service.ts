import { Injectable, NotFoundException } from '@nestjs/common';
import { BarbersRepository } from './barbers.repository';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateBarberDto } from './dto/create.barbers.dto';

@Injectable()
export class BarbersService {
    constructor(private readonly barbersRepo: BarbersRepository, private readonly prisma: PrismaService) { }

    async getAllBarbers() {
        try {
            const data = await this.prisma.usuarios.findMany({
                where: { id_rol: 3 },
                orderBy: { created_at: 'desc' },
                include: { portafolios: true }
            });
            return { success: true, data };
        } catch (error) {
            return { success: false, data: [] };
        }
    }

    async getPublicBarbers() {
        return this.barbersRepo.findActive();
    }

    async getBarberStats(id: number) {
        return this.barbersRepo.getStats(id);
    }
    // obtener los barberos llamandi la lógica de ts
    async obtenerBarberos() {
        return this.prisma.usuarios.findMany({
            where: {
                id_rol: 3,
            },
            include: {
                portafolios: true
            }
        })
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
            portafolios: {
                create: {
                    biografia: createBarberDto.biografia || null,
                    experiencia: createBarberDto.experiencia || null,
                    especialidades: createBarberDto.especialidades || null,
                }
            }
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

        if (!barbero) throw new NotFoundException(`Barbero con ID ${id} no encontrado`);
        
        const { password_hash, ...result } = barbero;
        return result;
    }

    async update(id: number, data: any) {
        await this.findOne(id); // Verifica si existe
        
        if (data.password_hash) {
            const salt = await bcrypt.genSalt(10);
            data.password_hash = await bcrypt.hash(data.password_hash, salt);
        }

        // Extraer datos del portafolio
        const portafolioData: any = {};
        if ('biografia' in data) { portafolioData.biografia = data.biografia; delete data.biografia; }
        if ('experiencia' in data) { portafolioData.experiencia = data.experiencia; delete data.experiencia; }
        if ('especialidades' in data) { portafolioData.especialidades = data.especialidades; delete data.especialidades; }

        // Actualizar usuario principal
        const actualizado = await this.prisma.usuarios.update({
            where: { id_usuario: id },
            data,
        });

        // Actualizar o crear portafolio si se enviaron datos
        if (Object.keys(portafolioData).length > 0) {
            const portafolioExistente = await this.prisma.portafolios.findFirst({
                where: { id_usuario: id }
            });

            if (portafolioExistente) {
                await this.prisma.portafolios.update({
                    where: { id_portafolio: portafolioExistente.id_portafolio },
                    data: portafolioData
                });
            } else {
                await this.prisma.portafolios.create({
                    data: {
                        ...portafolioData,
                        id_usuario: id
                    }
                });
            }
        }

        const { password_hash, ...result } = actualizado;
        return result;
    }

    async toggleStatus(id: number) {
        const barbero = await this.findOne(id);
        const newStatus = !barbero.estado;
        
        await this.prisma.usuarios.update({
            where: { id_usuario: id },
            data: { estado: newStatus }
        });

        return { success: true, newStatus };
    }

    async remove(id: number) {
        await this.findOne(id); // Verifica si existe
        
        // Soft delete
        return await this.prisma.usuarios.update({
            where: { id_usuario: id },
            data: { estado: false },
        });
    }

}
