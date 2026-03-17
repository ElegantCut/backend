import { Injectable } from '@nestjs/common';
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
        return this.barbersRepo.getStats(id);
    }
    // obtener los barberos llamandi la lógica de ts
    async obtenerBarberos() {
        return this.prisma.usuarios.findMany({
            where: {
                id_rol: 3,
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
        },
    });

    // Retornamos sin mostrar la contraseña por seguridad
    const { password_hash, ...result } = nuevoBarbero;
    return result;
}

}
