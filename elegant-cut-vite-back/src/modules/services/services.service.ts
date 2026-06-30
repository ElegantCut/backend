import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearServicioDto } from './dto/create-servicio.dto';
import { buildCloudinaryUrl } from '../../common/helpers/cloudinary-url.helper';

@Injectable()
export class ServicesService {
  constructor(
    private readonly servicesRepo: ServicesRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findAll() {
    const servicios = await this.servicesRepo.findAll();
    return servicios.map((s: any) => ({
      ...s,
      imagen_url: buildCloudinaryUrl(s.imagen),
    }));
  }

  async findAllAdmin() {
    try {
      const servicios = await this.prisma.servicios.findMany({
        orderBy: { id_servicio: 'desc' },
      });

      // Mapeamos los campos para que coincidan exactamente con lo que espera el Frontend React
      const data = servicios.map((s) => ({
        id_servicio: s.id_servicio,
        nombre_servicio: s.nombre,
        descripcion: s.descripcion,
        precio: s.precio,
        duracion_minutos: s.duracion,
        imagen_url: buildCloudinaryUrl(s.imagen),
      }));

      return { success: true, data };
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }

  async findAllCategories() {
    try {
      const categories = await this.prisma.categorias.findMany({
        include: { genero_servicio: true },
        orderBy: { nombre: 'asc' },
      });
      return { success: true, data: categories };
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  }

  async create(data: any) {
    return this.servicesRepo.create(data);
  }

  async obtenerServicios() {
    // Obtenemos los servicios y la tabla relacional 'categorias' para usar su nombre en Frontend
    return this.prisma.servicios.findMany({
      include: { categorias: true }, // <- ESTO TRAE EL NOMBRE DE LA CATEGORÍA RELACIONADA
    });
  }

  async findByGender(generoId: number) {
    // Encontramos primero las categorías que pertenecen al género
    const categorias = await this.prisma.categorias.findMany({
      where: { id_genero: generoId } as any,
    });
    const categoryIds = categorias.map((c) => c.id_categoria);

    // Luego buscamos los servicios de esas categorías
    return this.prisma.servicios.findMany({
      where: {
        id_categoria: {
          in: categoryIds,
        },
      },
      include: { categorias: true },
    });
  }

  //Este lo usamos para crear osea post

  async crearServicio(dato: CrearServicioDto) {
    return await this.prisma.servicios.create({
      data: dato,
    });
  }

  // --- NUEVOS MÉTODOS PARA EL CRUD DEL ADMIN ---

  async findOne(id: number) {
    const servicio = await this.prisma.servicios.findUnique({
      where: { id_servicio: id },
      include: { categorias: true },
    });
    if (!servicio)
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
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
    try {
      await this.findOne(id); // Verifica si existe

      await this.prisma.servicios.delete({
        where: { id_servicio: id },
      });
      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: 'No se pudo eliminar el servicio porque tiene dependencias.',
      };
    }
  }
}
