import { Injectable } from '@nestjs/common';
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
}
