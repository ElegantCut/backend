import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Dashboard - Panel Administrativo')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener estadísticas generales',
    description:
      'Devuelve métricas como total de barberos, usuarios, citas, etc. para el dashboard.',
  })
  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }

  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener actividad reciente',
    description:
      'Devuelve la lista de los últimos registros o acciones recientes del sistema.',
  })
  @Get('activity')
  async getActivity() {
    return this.dashboardService.getActivity();
  }
}
