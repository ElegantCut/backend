import { Injectable, NotFoundException } from '@nestjs/common';
import { PqrsRepository } from './pqrs.repository';
import { EmailService } from '../email/email.service';
import { CrearPqrsDto } from './dto/create-pqrs.dto';

@Injectable()
export class PqrsService {
  constructor(
    private readonly pqrsRepo: PqrsRepository,
    private readonly emailService: EmailService,
  ) {}

  async create(data: CrearPqrsDto) {
    // Guardar PQRS en DB
    const id = await this.pqrsRepo.create(data);

    // Enviar email de confirmación
    const radicado = `PQRS-${id}-${new Date().getFullYear()}`;

    await this.emailService.sendPqrsConfirmation(
      data.email,
      data.nombre_completo,
      radicado,
      data.tipo_solicitud,
    );

    return {
      success: true,
      radicado: `PQRS-${id}-${new Date().getFullYear()}`,
    };
  }

  async searchByUser(email: string) {
    return this.pqrsRepo.findByUserData(email);
  }

  async obtenerPqrs() {
    return this.pqrsRepo.obtenerPqrs();
  }

  // --- NUEVOS MÉTODOS PARA EL CRUD DEL ADMIN ---

  async findOne(id: number) {
    const pqrs = await this.pqrsRepo.findOne(id);

    if (!pqrs) throw new NotFoundException(`PQRS con ID ${id} no encontrada`);
    return pqrs;
  }

  async update(id: number, data: any) {
    await this.findOne(id); // Verifica si existe

    return await this.pqrsRepo.update(id, data);
  }

  async findByRadicado(radicado: string) {
    // Formato esperado: PQRS-{ID}-{AÑO}
    const parts = radicado.split('-');
    if (parts.length < 2 || parts[0].toUpperCase() !== 'PQRS') {
      return { success: false, error: 'Formato de radicado inválido' };
    }

    // El ID es la segunda parte del radicado
    const id = parseInt(parts[1], 10);
    if (isNaN(id)) {
      return { success: false, error: 'ID de radicado inválido' };
    }

    const pqrs = await this.pqrsRepo.findByRadicado(id);

    if (!pqrs) {
      return { success: false, error: 'No se encontró la PQRS' };
    }

    return { success: true, data: pqrs };
  }
}
