import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { UsersRepository } from '../users/users.repository';
import { PrismaService } from '../../prisma/prisma.service';
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

    // Nuevo método formateado específicamente para el listado del panel de Administrador
    async findAllAdmin() {
        try {
            const citas = await this.prisma.reservas.findMany({
                include: {
                    usuarios: true,
                    horarios: true,
                    detalle_cita_servicio: {
                        include: { servicios: true }
                    }
                },
                orderBy: { fecha: 'desc' }
            });

            const data = citas.map(cita => {
                // Determinar estado textual sugerido (1=Pendiente, 2=Completada, 3=Cancelada)
                let estadoText = 'Pendiente';
                if (cita.id_estado_cita === 2) estadoText = 'Completada';
                if (cita.id_estado_cita === 3) estadoText = 'Cancelada';

                // Extraer el nombre del servicio principal
                const srv = cita.detalle_cita_servicio?.[0]?.servicios;
                const nombreServicio = srv ? srv.nombre : 'Servicio general';

                // Formatear hora inicio (ej. 900 -> "9:00 AM")
                let horaStr = cita.horarios?.hora_inicio?.toString() || '000';
                if (horaStr.length === 3) horaStr = '0' + horaStr; // 900 -> 0900
                const hh = horaStr.slice(0, 2);
                const mm = horaStr.slice(2, 4);
                const horaFormat = `${hh}:${mm}`;

                return {
                    id_reservas: cita.id_reservas,
                    fecha: cita.fecha,
                    hora_inicio: horaFormat,
                    cliente: cita.usuarios ? `${cita.usuarios.prim_nombre} ${cita.usuarios.apellido1}` : 'Desconocido',
                    servicio: nombreServicio,
                    estado: estadoText
                };
            });

            return { success: true, data };
        } catch (error) {
            console.error("Error fetching admin appointments:", error);
            return { success: false, data: [] };
        }
    }

    // Nuevo método formateado específicamente para el listado del panel de Administrador
    async changeStatusAdmin(id: number, nuevoEstado: number) {
        try {
            await this.prisma.reservas.update({
                where: { id_reservas: id },
                data: { id_estado_cita: nuevoEstado }
            });
            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false };
        }
    }

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
        const id_servicio = Number(datos.id_servicio);
        const reservaData = {
            fecha: new Date(datos.fecha),
            observaciones: datos.observaciones,
            id_usuario: Number(datos.id_usuario),
            id_empleado: Number(datos.id_empleado),
            id_estado_cita: Number(datos.id_estado_cita),
            id_horarios: Number(datos.id_horarios),
        };
        
        return await this.prisma.$transaction(async (tx) => {
            // 1. Crear la reserva
            const reserva = await tx.reservas.create({
                data: reservaData,
            });

            // 2. Crear el detalle con el servicio
            await tx.detalle_cita_servicio.create({
                data: {
                    id_reservas: reserva.id_reservas,
                    id_servicio: id_servicio
                }
            });

            return reserva;
        });
    }

    async getHorarios() {
        return await this.prisma.horarios.findMany({
            orderBy: { hora_inicio: 'asc' }
        });
    }

    // --- NUEVOS MÉTODOS PARA EL CRUD DEL ADMIN ---

    async findOne(id: number) {
        const cita = await this.prisma.reservas.findUnique({
            where: { id_reservas: id },
            include: {
                usuarios: {
                    select: { prim_nombre: true, apellido1: true, telefono: true, email: true }
                },
                estado_cita: true,
                horarios: true,
                detalle_cita_servicio: {
                    include: { servicios: true }
                }
            }
        });

        if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
        return cita;
    }

    async getAppointmentsByUser(userId: number) {
        try {
            const numericUserId = Number(userId);
            const citas = await this.prisma.reservas.findMany({
                where: { id_usuario: numericUserId },
                include: {
                    horarios: true,
                    estado_cita: true,
                    detalle_cita_servicio: {
                        include: { servicios: true }
                    }
                },
                orderBy: { fecha: 'desc' }
            });

            return { success: true, data: citas };
        } catch (error) {
            console.error("Error fetching user appointments:", error);
            return { success: false, data: [] };
        }
    }

    async update(id: number, data: any) {
        await this.findOne(id); // Verifica si existe

        // Si mandan una fecha en string, la parseamos a Date
        if (data.fecha) {
            data.fecha = new Date(data.fecha);
        }

        return await this.prisma.reservas.update({
            where: { id_reservas: id },
            data,
            include: { estado_cita: true }
        });
    }
}
