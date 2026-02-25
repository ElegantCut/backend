import { Injectable } from '@nestjs/common';
import { ServicesRepository } from './services.repository';

@Injectable()
export class ServicesService {
    constructor(private readonly servicesRepo: ServicesRepository) { }

    async findAll() {
        return this.servicesRepo.findAll();
    }

    async create(data: any) {
        return this.servicesRepo.create(data);
    }
}
