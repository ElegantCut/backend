import { Injectable, NotFoundException } from '@nestjs/common';
import { BarbersRepository } from './barbers.repository';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
