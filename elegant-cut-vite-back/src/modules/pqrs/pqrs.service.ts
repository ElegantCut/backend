import { Injectable } from '@nestjs/common';
import { PqrsRepository } from './pqrs.repository';
import { EmailService } from '../email/email.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearPqrsDto } from './dto/create-pqrs.dto';

@Injectable()
export class PqrsService {
    constructor(
        private readonly pqrsRepo: PqrsRepository,
        private readonly emailService: EmailService,
        private readonly prisma: PrismaService,
    ) { }

    async create(data: CrearPqrsDto) {
        // Guardar PQRS en DB
        const id = await this.pqrsRepo.create(data);

        // Enviar email de confirmación
        const radicado = `PQRS-${id}-${new Date().getFullYear()}`;

        await this.emailService.sendPqrsConfirmation(
            data.email,
            data.nombre_completo,
            radicado,
            data.tipo_solicitud
        );

        return { success: true, radicado: `PQRS-${id}-${new Date().getFullYear()}` };
    }

    async searchByUser(email: string) {
        return this.pqrsRepo.findByUserData(email);
    }

    async obtenerPqrs() {
        return this.prisma.pqrs.findMany();
    }
}
