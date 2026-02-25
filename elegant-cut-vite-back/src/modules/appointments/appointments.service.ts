import { Injectable } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class AppointmentsService {
    constructor(
        private readonly appointmentsRepo: AppointmentsRepository,
        private readonly usersRepo: UsersRepository,
    ) { }

    async getAvailability(date: string, barberId: number) {
        return this.appointmentsRepo.getAvailableSlots(date, barberId);
    }

    async bookAppointment(data: any) {
        // Aquí puedes incluir el flujo de buscar o crear usuario que estaba en el modelo viejo
        return this.appointmentsRepo.create(data);
    }

    async getAll() {
        return this.appointmentsRepo.findAll();
    }
}
