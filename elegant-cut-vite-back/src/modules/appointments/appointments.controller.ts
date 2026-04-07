import { Controller, Get, Post, Body, Query, Param, Patch, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('Appointments - Citas y Reservas')
@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }
    // Debug: Route user/:userId should be registered.
    // estos son los get
    @ApiOperation({ summary: 'Consultar disponibilidad', description: 'Devuelve los horarios disponibles para un barbero en una fecha específica.' })
    @ApiQuery({ name: 'date', description: 'Fecha a consultar (YYYY-MM-DD)', example: '2023-12-01' })
    @ApiQuery({ name: 'barberId', description: 'ID del barbero', example: '2' })
    @Get('availability')
    async getAvailability(@Query('date') date: string, @Query('barberId') barberId: string) {
        return this.appointmentsService.getAvailability(date, +barberId);
    }

    @ApiOperation({ summary: 'Obtener todas las citas (Admin Dashboard)', description: 'Devuelve todas las reservas con un formato específico para la tabla del dashboard admin.' })
    @Get('admin/all')
    async getAllAdmin() {
        return this.appointmentsService.findAllAdmin();
    }

    @ApiOperation({ summary: 'Cambiar el estado de una cita', description: 'Permite aprobar o cancelar una cita desde el panel de control.' })
    @Patch('admin/:id/status')
    async changeStatus(@Param('id', ParseIntPipe) id: number, @Body('nuevoEstado') nuevoEstado: number) {
        return this.appointmentsService.changeStatusAdmin(id, nuevoEstado);
    }

    @ApiOperation({ summary: 'Obtener todas las citas', description: 'Devuelve el historial completo de citas.' })
    @Get()
    async getAll() {
        return this.appointmentsService.getAll();
    }

    //Este es el nuevo get para llevar las reservas
    @ApiOperation({ summary: 'Obtener citas por barbero', description: 'Devuelve la lista de citas asignadas a un barbero específico.' })
    @ApiParam({ name: 'id', description: 'ID del empleado/barbero', example: '2' })
    @Get('barber/:id')
    async getByBarber(@Param('id') id: string) {
        return this.appointmentsService.getAppointmentsByBarber(+id);
    }



    //aca voy a añadir los post

    @ApiOperation({ summary: 'Agendar nueva cita', description: 'Crea una nueva reserva de cita conectando a un cliente con un barbero en un horario específico.' })
    @ApiResponse({ status: 201, description: 'Cita creada exitosamente.' })
    @Post()
    async createAppointment(@Body() CreateAppointmentDto: CreateAppointmentDto) {
        return this.appointmentsService.createAppointment(CreateAppointmentDto);
    }

    @ApiOperation({ summary: 'Obtener todas las citas por usuario', description: 'Devuelve la lista de citas realizadas por un usuario específico.' })
    @ApiParam({ name: 'userId', description: 'ID del usuario', example: '1' })
    @Get('user/:userId')
    async getByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.appointmentsService.getAppointmentsByUser(userId);
    }

    @ApiOperation({ summary: 'Obtener todos los bloques de horarios', description: 'Devuelve la lista de bloques de tiempo (horarios) disponibles en la base de datos.' })
    @Get('horarios')
    async getHorarios() {
        return this.appointmentsService.getHorarios();
    }

    @ApiOperation({ summary: 'Obtener recordatorios para mañana', description: 'Devuelve una lista simplificada de citas de mañana para n8n.' })
    @Get('reminders/tomorrow')
    async getRemindersTomorrow() {
        return this.appointmentsService.getTomorrowReminders();
    }

    @ApiOperation({ summary: 'Obtener detalle de una cita', description: 'Devuelve toda la información de una reserva específica incluyendo usuario, barbero y servicios afines.' })
    @ApiParam({ name: 'id', description: 'ID de la reserva', example: 1 })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.appointmentsService.findOne(id);
    }

    @ApiOperation({ summary: 'Actualizar estado o datos de la cita (Admin)', description: 'Permite al administrador o barbero procesar cambios, Ej: confirmar cita, cancelar cita.' })
    @ApiParam({ name: 'id', description: 'ID de la reserva a modificar', example: 1 })
    @ApiResponse({ status: 200, description: 'Cita actualizada exitosamente.' })
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateAppointmentDto: UpdateAppointmentDto) {
        return this.appointmentsService.update(id, updateAppointmentDto);
    }
}
