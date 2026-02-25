import { Injectable } from '@nestjs/common';
import { PqrsRepository } from './pqrs.repository';
import { EmailService } from '../email/email.service';

@Injectable()
export class PqrsService {
    constructor(
        private readonly pqrsRepo: PqrsRepository,
        private readonly emailService: EmailService,
    ) { }

    async create(data: any) {
        const id = await this.pqrsRepo.create(data);

        // Enviar email de confirmación
        const radicado = `PQRS-${id}-${new Date().getFullYear()}`;
        await this.emailService.sendPqrsConfirmation(
            data.userEmail,
            data.userName,
            radicado,
            data.requestType
        );

        return { success: true, radicado };
    }

    async searchByUser(email: string, phone: string) {
        return this.pqrsRepo.findByUserData(email, phone);
    }
}
