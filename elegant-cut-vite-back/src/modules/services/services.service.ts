import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearServicioDto } from './dto/create-servicio.dto';

@Injectable()
export class ServicesService {
    constructor(private readonly servicesRepo: ServicesRepository, private readonly prisma: PrismaService) { }

    async findAll() {
        return this.servicesRepo.findAll();
    }

    async create(data: any) {
        if (!data || !data.nombre) {
            throw new BadRequestException('El nombre del servicio es requerido');
        }

        return this.servicesRepo.create(data);
    }

    async obtenerServicios() {
        return this.prisma.servicios.findMany();
    }

    //Este lo usamos para crear osea post

    async crearServicio(dato: CrearServicioDto) {
        if (!dato.nombre) {
            throw new BadRequestException('El nombre del servicio es requerido');
        }

        return await this.prisma.servicios.create({
            data: dato,
        });
    }
}
