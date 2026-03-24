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

    async create(data: any) {
        return this.servicesRepo.create(data);
    }

    async obtenerServicios() {
        // Obtenemos los servicios y la tabla relacional 'categorias' para usar su nombre en Frontend
        return this.prisma.servicios.findMany({
            include: { categorias: true } // <- ESTO TRAE EL NOMBRE DE LA CATEGORÍA RELACIONADA
        });
    }

    async findByGender(generoId: number) {
        // Encontramos primero las categorías que pertenecen al género
        const categorias = await this.prisma.categorias.findMany({
            where: { id_genero: generoId } as any
        });
        const categoryIds = categorias.map(c => c.id_categoria);

        // Luego buscamos los servicios de esas categorías
        return this.prisma.servicios.findMany({
            where: {
                id_categoria: {
                    in: categoryIds
                }
            },
            include: { categorias: true }
        });
    }

    //Este lo usamos para crear osea post

    async crearServicio(dato: CrearServicioDto) {
        return await this.prisma.servicios.create({
            data: dato,
        })
    }

    // --- NUEVOS MÉTODOS PARA EL CRUD DEL ADMIN ---

    async findOne(id: number) {
        const servicio = await this.prisma.servicios.findUnique({
            where: { id_servicio: id },
            include: { categorias: true }
        });

        if (!servicio) throw new Error(`Servicio con ID ${id} no encontrado`);
        return servicio;
    }

    async update(id: number, data: any) {
        await this.findOne(id); // Verifica si existe

        return await this.prisma.servicios.update({
            where: { id_servicio: id },
            data,
        });
    }

    async remove(id: number) {
        await this.findOne(id); // Verifica si existe

        // Aquí SÍ podemos hacer un borrado real o mantener el soft delete si tienes una columna estado
        // Asumiendo que quieres borrarlo de BD
        return await this.prisma.servicios.delete({
            where: { id_servicio: id },
        });
    }
}
