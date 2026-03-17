import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@ApiTags('Appointments - Citas y Reservas')
@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }
    // estos son los get
    @ApiOperation({ summary: 'Consultar disponibilidad', description: 'Devuelve los horarios disponibles para un barbero en una fecha específica.' })
    @ApiQuery({ name: 'date', description: 'Fecha a consultar (YYYY-MM-DD)', example: '2023-12-01' })
    @ApiQuery({ name: 'barberId', description: 'ID del barbero', example: '2' })
    @Get('availability')
    async getAvailability(@Query('date') date: string, @Query('barberId') barberId: string) {
        return this.appointmentsService.getAvailability(date, +barberId);
    }

    @ApiOperation({ summary: 'Obtener todas las citas', description: 'Devuelve el historial completo de citas (Ideal para el dashboard admin).' })
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
}
