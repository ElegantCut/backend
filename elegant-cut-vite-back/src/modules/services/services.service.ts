import { Injectable, NotFoundException } from '@nestjs/common';
import { ServicesRepository } from './services.repository';
import { CrearServicioDto } from './dto/create-servicio.dto';
import { buildCloudinaryUrl } from '../../common/helpers/cloudinary-url.helper';

@Injectable()
export class ServicesService {
  constructor(
    private readonly servicesRepo: ServicesRepository,
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
      const servicios = await this.servicesRepo.findAllAdmin();

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
      const categories = await this.servicesRepo.findAllCategories();
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
    return this.servicesRepo.findAll();
  }

  async findByGender(generoId: number) {
    return this.servicesRepo.findByGender(generoId);
  }

  async crearServicio(dato: CrearServicioDto) {
    return await this.servicesRepo.crearServicio(dato);
  }

  // --- NUEVOS MÉTODOS PARA EL CRUD DEL ADMIN ---

  async findOne(id: number) {
    const servicio = await this.servicesRepo.findById(id);
    if (!servicio)
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    return servicio;
  }

  async update(id: number, data: any) {
    await this.findOne(id); // Verifica si existe

    return await this.servicesRepo.update(id, data);
  }

  async remove(id: number) {
    try {
      await this.findOne(id); // Verifica si existe

      await this.servicesRepo.remove(id);
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
