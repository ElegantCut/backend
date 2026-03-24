import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
        if (!date || !barberId) {
            throw new BadRequestException('La fecha y el ID del barbero son requeridos');
        }
        return this.appointmentsRepo.getAvailableSlots(date, barberId);
    }

    async bookAppointment(data: any) {
        if (!data) {
            throw new BadRequestException('Los datos de la cita son requeridos');
        }
        return this.appointmentsRepo.create(data);
    }

    async getAll() {
        return this.appointmentsRepo.findAll();
    }

    // este método es para obtener las citas que se le asignaron al barbero 

    async getAppointmentsByBarber(barberId: number) {
        const citas = await this.prisma.reservas.findMany({
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
        });

        if (!citas || citas.length === 0) {
            throw new NotFoundException(`No se encontraron citas para el barbero con ID ${barberId}`);
        }

        return citas;
    }

    async createAppointment(datos: CreateAppointmentDto) {
        if (!datos.fecha) {
            throw new BadRequestException('La fecha de la cita es requerida');
        }

        return await this.prisma.reservas.create({
            data: {
                ...datos,
                fecha: new Date(datos.fecha),
            },
        });
    }
}
