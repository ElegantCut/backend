import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// ─── SOLID: SRP ───────────────────────────────────────────────────────────────
// Controlador exclusivo para que los clientes vean disponibilidad,
// reserven citas y vean sus propias reservas.
// ──────────────────────────────────────────────────────────────────────────────
@ApiTags('Appointments - Citas y Reservas')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiOperation({
    summary: 'Obtener todos los bloques de horarios',
    description: 'Devuelve la lista de bloques de tiempo disponibles.',
  })
  @Get('horarios')
  async getHorarios() {
    return this.appointmentsService.getHorarios();
  }

  @ApiOperation({
    summary: 'Obtener recordatorios para mañana',
    description: 'Devuelve una lista simplificada de citas de mañana para n8n.',
  })
  @Get('reminders/tomorrow')
  async getRemindersTomorrow() {
    return this.appointmentsService.getTomorrowReminders();
  }

  @ApiOperation({
    summary: 'Consultar disponibilidad',
    description:
      'Devuelve los horarios disponibles para un barbero en una fecha específica.',
  })
  @ApiQuery({
    name: 'date',
    description: 'Fecha a consultar (YYYY-MM-DD)',
    example: '2023-12-01',
  })
  @ApiQuery({ name: 'barberId', description: 'ID del barbero', example: '2' })
  @Get('availability')
  async getAvailability(
    @Query('date') date: string,
    @Query('barberId') barberId: string,
  ) {
    return this.appointmentsService.getAvailability(date, +barberId);
  }

  @ApiOperation({
    summary: 'Obtener citas por barbero',
    description:
      'Devuelve la lista de citas asignadas a un barbero específico (Vista pública).',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del empleado/barbero',
    example: '2',
  })
  @Get('barber/:id')
  async getByBarber(@Param('id') id: string) {
    return this.appointmentsService.getAppointmentsByBarber(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // El cliente DEBE estar logueado para crear una cita
  @ApiOperation({
    summary: 'Agendar nueva cita',
    description:
      'Crea una nueva reserva de cita conectando a un cliente con un barbero.',
  })
  @ApiResponse({ status: 201, description: 'Cita creada exitosamente.' })
  @Post()
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(createAppointmentDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // El cliente DEBE estar logueado para ver sus citas
  @ApiOperation({
    summary: 'Obtener todas las citas por usuario',
    description:
      'Devuelve la lista de citas realizadas por un usuario (Mi perfil).',
  })
  @ApiParam({ name: 'userId', description: 'ID del usuario', example: '1' })
  @Get('user/:userId')
  async getByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.appointmentsService.getAppointmentsByUser(userId);
  }

  @ApiOperation({
    summary: 'Obtener detalle de una cita',
    description: 'Devuelve toda la información de una reserva específica.',
  })
  @ApiParam({ name: 'id', description: 'ID de la reserva', example: 1 })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }
}
