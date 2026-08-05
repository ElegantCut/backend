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
    return this.portafoliosRepo.create(data);
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
