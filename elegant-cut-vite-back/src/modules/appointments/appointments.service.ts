import { Injectable } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { UsersRepository } from '../users/users.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
    constructor(
        private readonly appointmentsRepo: AppointmentsRepository,
        private readonly usersRepo: UsersRepository,
        private readonly prisma: PrismaService,
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

    // este método es para obtener las citas que se le asignaron al barbero 

    async getAppointmentsByBarber(barberId: number) {
        return await this.prisma.reservas.findMany({
            where: {
                id_empleado: barberId,
            },
            include: {
                usuarios: true,
                detalle_cita_servicio: {
                    include: {
                        servicios: true
                    }
                }
            }
        })
    }

    async createAppointment(datos: CreateAppointmentDto) {
        return await this.prisma.reservas.create({
            data: {
                ...datos,
                fecha: new Date(datos.fecha),
            },
        })
    }
}
