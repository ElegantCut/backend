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

        const condicionBusqueda = user.id_rol === 3 ? { id_empleado: id } : { id_usuario: id };

        // Citas realizadas (todas las reservas del usuario o barbero)
        const citasRealizadas = await this.prisma.reservas.count({
            where: condicionBusqueda
        });

        // Citas pendientes (reservas en fechas futuras)
        const citasPendientes = await this.prisma.reservas.count({
            where: {
                ...condicionBusqueda,
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
        const user = await this.findOne(id);
        
        const condicionBusqueda = user.id_rol === 3 ? { id_empleado: id } : { id_usuario: id };

        // Buscamos las últimas 10 reservas vinculadas al usuario o barbero
        const reservas = await this.prisma.reservas.findMany({
            where: condicionBusqueda,
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
            const estadoId = reserva.id_estado_cita;
            let estadoTexto = 'Pendiente';
            let tipo = 'info';
            
            if (estadoId === 2) {
                estadoTexto = 'Completada';
                tipo = 'success';
            } else if (estadoId === 3) {
                estadoTexto = 'Cancelada';
                tipo = 'warning';
            }

            const servicio = reserva.detalle_cita_servicio?.[0]?.servicios?.nombre || 'Cita';
            const fechaHora = new Date(reserva.fecha).toLocaleDateString('es-ES', { 
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
            });

            return {
                id: reserva.id_reservas,
                titulo: `Cita ${estadoTexto}`,
                mensaje: `La reserva de ${servicio} para el ${fechaHora} ha sido marcada como ${estadoTexto.toUpperCase()}.`,
                fecha: reserva.fecha,
                tipo: tipo,
                leida: false
            };
        });
    }

    async getUserAppointments(id: number) {
        // Verificar que el usuario exista
        const user = await this.findOne(id);
        
        const hoy = new Date();
        const condicionBusqueda = user.id_rol === 3 ? { id_empleado: id } : { id_usuario: id };

        // Obtener todas las reservas vinculadas al perfil (cliente o barbero)
        const reservas = await this.prisma.reservas.findMany({
            where: condicionBusqueda,
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
        const cleanReservas = reservas.map(r => {
            const estadoId = r.id_estado_cita;
            let estadoTexto = 'Pendiente';
            if (estadoId === 2) estadoTexto = 'Completada';
            if (estadoId === 3) estadoTexto = 'Cancelada';

            // Es pasada si la fecha ya pasó o si ya fue completada/cancelada
            const esPasada = r.fecha < hoy || estadoId === 2 || estadoId === 3;
            // Es activa solo si está pendiente (1) y la fecha no ha pasado (o es de hoy sin completar)
            const esActiva = estadoId === 1 && r.fecha >= hoy;

            return {
                id: r.id_reservas,
                fecha: r.fecha,
                servicio: r.detalle_cita_servicio?.[0]?.servicios?.nombre || 'Cita de Barbería',
                precio: r.detalle_cita_servicio?.[0]?.servicios?.precio || 0,
                barbero: 'Asignado',
                estado: estadoTexto,
                esPasada,
                esActiva
            };
        });

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