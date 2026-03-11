import { Injectable } from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearServicioDto } from './dto/create-servicio.dto';

@Injectable()
export class ServicesService {

    constructor(private readonly servicesRepo: ServicesRepository, private readonly prisma: PrismaService) { }

    async findAll() {
        return this.servicesRepo.findAll();
    }

    async create(data: CrearServicioDto) {
        return this.servicesRepo.create(data);
    }

    async obtenerServicios() {
        // Obtenemos los servicios y la tabla relacional 'categorias' para usar su nombre en Frontend
        return this.prisma.servicios.findMany({
            include: { categorias: true } // <- ESTO TRAE EL NOMBRE DE LA CATEGORÍA RELACIONADA
        });
    }

    //Este lo susamos para crear osea post

    async crearServicio(dato: CrearServicioDto) {
        return await this.prisma.servicios.create({
            data: dato,
        })
    }
}
