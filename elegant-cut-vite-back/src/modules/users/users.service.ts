import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { CrearUsuarioDto } from './dto/create-users.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly prisma: PrismaService
    ) { }

    async findOneByUsername(username: string) {
        const user = await this.usersRepo.findByUsername(username);
        if (!user) throw new NotFoundException('Usuario no encontrado');
        return user;
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    /**
     * ACTUALIZAR FOTO CON CLOUDINARY
     * Este método reemplaza la lógica local por la de la nube.
     */
    async updatePhoto(id_usuario: number, public_id: string) {
        // 1. Verificamos que el usuario exista en la tabla SQL
        const usuario = await this.prisma.usuarios.findUnique({
            where: { id_usuario },
        });

        if (!usuario) {
            throw new NotFoundException(`El usuario con ID ${id_usuario} no fue encontrado.`);
        }

        // 2. Actualizamos la columna foto_perfil con el ID de Cloudinary
        return await this.prisma.usuarios.update({
            where: { id_usuario },
            data: {
                foto_perfil: public_id
            },
        });
    }

    // MÉTODOS DE PRISMA EXISTENTES
    async obtenerTodos() {
        return this.prisma.usuarios.findMany();
    }

    async crearUsuario(data: CrearUsuarioDto) {
        // Encriptar la contraseña antes de guardar el usuario
        const hashedPassword = await this.hashPassword(data.password_hash);

        return await this.prisma.usuarios.create({
            data: {
                username: data.username,
                prim_nombre: data.prim_nombre,
                seg_nombre: data.seg_nombre,
                apellido1: data.apellido1,
                apellido2: data.apellido2,
                email: data.email,
                password_hash: hashedPassword,
                telefono: data.telefono,
                estado: data.estado !== undefined ? data.estado : true,
                id_rol: data.id_rol !== undefined ? data.id_rol : 2,
                foto_perfil: data.foto_perfil
            },
        });
    }

    // --- NUEVOS MÉTODOS PARA EL CRUD DEL ADMIN ---

    async findOne(id: number) {
        const usuario = await this.prisma.usuarios.findUnique({
            where: { id_usuario: id },
            include: { rol: true } // Opcional: Para devolver el nombre del rol también
        });

        if (!usuario) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        return usuario;
    }

    async getUserStats(id: number) {
        // Obtenemos el usuario para su email (necesario para buscar reseñas)
        const user = await this.prisma.usuarios.findUnique({ where: { id_usuario: id } });
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }

        // Citas realizadas (todas las reservas del usuario)
        const citasRealizadas = await this.prisma.reservas.count({
            where: { id_usuario: id }
        });

        // Citas pendientes (reservas del usuario en fechas futuras)
        const citasPendientes = await this.prisma.reservas.count({
            where: {
                id_usuario: id,
                fecha: { gt: new Date() }
            }
        });

        // Calificación promedio (Busca las reseñas asocidas al email del usuario)
        const agregaciones = await this.prisma.resenas.aggregate({
            _avg: { calificacion: true },
            where: { email_cliente: user.email, estado: 1 }
        });

        const calificacionPromedio = agregaciones._avg.calificacion ? Number(agregaciones._avg.calificacion.toFixed(1)) : 0;

        // Puntos acumulados (simulación de 10 puntos por cita)
        const puntosAcumulados = citasRealizadas * 10;

        return {
            citasRealizadas,
            citasPendientes,
            calificacionPromedio,
            puntosAcumulados
        };
    }

    async getUserNotifications(id: number) {
        // Obtenemos al usuario
        await this.findOne(id);

        // Buscamos las últimas 10 reservas del usuario
        const reservas = await this.prisma.reservas.findMany({
            where: { id_usuario: id },
            orderBy: { fecha: 'desc' },
            take: 10,
            include: {
                estado_cita: true,
                detalle_cita_servicio: {
                    include: { servicios: true }
                }
            }
        });

        // Formatear como array de notificaciones legibles
        return reservas.map(reserva => {
            const esConfirmada = reserva.estado_cita?.confirmada;
            const estadoTexto = esConfirmada ? 'Confirmada' : 'Cancelada o Pendiente';
            const servicio = reserva.detalle_cita_servicio?.[0]?.servicios?.nombre || 'Cita';
            const fechaHora = new Date(reserva.fecha).toLocaleDateString('es-ES', { 
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
            });

            return {
                id: reserva.id_reservas,
                titulo: `Reserva ${estadoTexto}`,
                mensaje: `Tu reserva de ${servicio} para el ${fechaHora} se encuentra ${estadoTexto.toLowerCase()}.`,
                fecha: reserva.fecha,
                tipo: esConfirmada ? 'success' : 'warning',
                leida: false
            };
        });
    }

    async getUserAppointments(id: number) {
        // Verificar que el usuario exista
        await this.findOne(id);
        
        const hoy = new Date();

        // Obtener todas las reservas del usuario
        const reservas = await this.prisma.reservas.findMany({
            where: { id_usuario: id },
            orderBy: { fecha: 'desc' },
            include: {
                estado_cita: true,
                detalle_cita_servicio: {
                    include: { servicios: true }
                },
                horarios: true
            }
        });

        // Mapear los datos a un formato limpio para el frontend
        const cleanReservas = reservas.map(r => ({
            id: r.id_reservas,
            fecha: r.fecha,
            servicio: r.detalle_cita_servicio?.[0]?.servicios?.nombre || 'Cita de Barbería',
            precio: r.detalle_cita_servicio?.[0]?.servicios?.precio || 0,
            barbero: 'Barbero Asignado',
            estado: r.estado_cita?.confirmada ? 'Confirmada' : (r.estado_cita?.confirmada === false ? 'Cancelada' : 'Pendiente'),
            esPasada: r.fecha < hoy,
            esActiva: r.fecha >= hoy && r.estado_cita?.confirmada !== false
        }));

        // Clasificamos las citas
        const activas = cleanReservas.filter(c => c.esActiva);
        const historial = cleanReservas.filter(c => !c.esActiva); // pasadas o canceladas

        return { activas, historial };
    }

    async update(id: number, data: any) {
        await this.findOne(id); // Verifica si existe primero
        
        // Si el admin envía una contraseña nueva, la encriptamos
        if (data.password_hash) {
            data.password_hash = await this.hashPassword(data.password_hash);
        }

        return await this.prisma.usuarios.update({
            where: { id_usuario: id },
            data,
        });
    }

    async remove(id: number) {
        await this.findOne(id); // Verifica si existe

        // Borrado suave (soft-delete): Cambiamos su estado a false (inactivo)
        return await this.prisma.usuarios.update({
            where: { id_usuario: id },
            data: { estado: false },
        });
    }
}