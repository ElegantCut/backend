import { Injectable } from '@nestjs/common';
import { BarbersRepository } from './barbers.repository';

@Injectable()
export class BarbersService {
    constructor(private readonly barbersRepo: BarbersRepository) { }

    async getAllBarbers() {
        return this.barbersRepo.findAll();
    }

    async getPublicBarbers() {
        return this.barbersRepo.findActive();
    }

    async getBarberStats(id: number) {
        return this.barbersRepo.getStats(id);
    }
}
