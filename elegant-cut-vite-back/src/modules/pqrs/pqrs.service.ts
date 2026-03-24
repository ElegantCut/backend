import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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

        if (!id) {
            throw new InternalServerErrorException('No se pudo registrar la PQRS');
        }

        // Enviar email de confirmación
        const radicado = `PQRS-${id}-${new Date().getFullYear()}`;

        try {
            await this.emailService.sendPqrsConfirmation(
                data.email,
                data.nombre_completo,
                radicado,
                data.tipo_solicitud
            );
        } catch {
            // El email falló pero la PQRS ya fue guardada; no bloqueamos al usuario
        }

        return { success: true, radicado };
    }

    async searchByUser(email: string) {
        const result = await this.pqrsRepo.findByUserData(email);

        if (!result || result.length === 0) {
            throw new NotFoundException(`No se encontraron PQRS para el email: ${email}`);
        }

        return result;
    }

    async obtenerPqrs() {
        return this.prisma.pqrs.findMany();
    }
}
