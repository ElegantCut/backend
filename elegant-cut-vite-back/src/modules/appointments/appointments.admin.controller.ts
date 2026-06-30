import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// ─── SOLID: SRP ───────────────────────────────────────────────────────────────
// Controlador exclusivo para la gestión interna de citas por parte del
// Staff (Administradores y Barberos).
// ──────────────────────────────────────────────────────────────────────────────
@ApiTags('Appointments - Administración')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // Guard a nivel de clase
@Controller('appointments')
export class AppointmentsAdminController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Roles(1, 3) // Admin y Barbero pueden ver todas las citas
  @ApiOperation({
    summary: 'Obtener todas las citas (Admin Dashboard)',
    description:
      'Devuelve todas las reservas con un formato específico para la tabla del dashboard.',
  })
  @Get('admin/all')
  async getAllAdmin() {
    return this.appointmentsService.findAllAdmin();
  }

  @Roles(1, 3) // Admin y Barbero pueden cambiar el estado
  @ApiOperation({
    summary: 'Cambiar el estado de una cita',
    description:
      'Permite aprobar o cancelar una cita desde el panel de control.',
  })
  @Patch('admin/:id/status')
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('nuevoEstado') nuevoEstado: any,
  ) {
    return this.appointmentsService.changeStatusAdmin(id, Number(nuevoEstado));
  }

  @Roles(1) // OJO: Solo el Admin Supremo puede ver el historial completo
  @ApiOperation({
    summary: 'Obtener historial completo',
    description: 'Devuelve el historial completo de citas en el sistema.',
  })
  @Get('history') // Le cambiamos el path para no chocar con métodos Get públicos
  async getAll() {
    return this.appointmentsService.getAll();
  }

  @Roles(1, 3) // Admin y Barbero
  @ApiOperation({
    summary: 'Actualizar estado o datos de la cita (Admin)',
    description:
      'Permite al administrador o barbero procesar cambios, Ej: confirmar cita, cancelar cita.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva a modificar',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'Cita actualizada exitosamente.' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }
}
