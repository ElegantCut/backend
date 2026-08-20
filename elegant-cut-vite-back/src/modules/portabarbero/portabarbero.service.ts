import { Injectable, NotFoundException } from '@nestjs/common';
import { PortabarberoRepository } from './portabarbero.repository';

@Injectable()
export class PortabarberoService {
  constructor(private portafoliosRepo: PortabarberoRepository) {}

  async getAllPortafolios() {
    return this.portafoliosRepo.findAll();
  }

  async getPortafolioByBarber(barberId: number) {
    return this.portafoliosRepo.findByUserId(barberId);
  }

  async crearPortafolio(data: any) {
    try {
      const payload = {
        ...data,
        especialidades: Array.isArray(data.especialidades) ? JSON.stringify(data.especialidades) : data.especialidades,
        fotos_portafolio: Array.isArray(data.fotos_portafolio) ? JSON.stringify(data.fotos_portafolio) : data.fotos_portafolio,
      };

      const existing = await this.portafoliosRepo.findByUserId(data.id_usuario);
      if (existing) {
        return await this.portafoliosRepo.update(existing.id_portafolio, payload);
      }
      return await this.portafoliosRepo.create(payload);
    } catch (error) {
      require('fs').writeFileSync('C:/Elegan-vite/Elegant-cut--flow-backend/elegant-cut-vite-back/error_dump.txt', String(error) + '\\n' + error.stack);
      console.error(error);
      throw new Error(error.message);
    }
  }

  async updatePortafolio(id: number, data: any) {
    const portafolio = await this.portafoliosRepo.findById(id);
    if (!portafolio) throw new NotFoundException('Portafolio no encontrado');
    return this.portafoliosRepo.update(id, data);
  }

  async deletePortafolio(id: number) {
    const portafolio = await this.portafoliosRepo.findById(id);
    if (!portafolio) throw new NotFoundException('Portafolio no encontrado');
    return this.portafoliosRepo.delete(id);
  }
}
