import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard - Panel Administrativo')
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @ApiOperation({ summary: 'Obtener estadísticas generales', description: 'Devuelve métricas como total de barberos, usuarios, citas, etc. para el dashboard.' })
    @Get('stats')
    async getStats() {
        return this.dashboardService.getStats();
    }

    @ApiOperation({ summary: 'Obtener actividad reciente', description: 'Devuelve la lista de los últimos registros o acciones recientes del sistema.' })
    @Get('activity')
    async getActivity() {
        return this.dashboardService.getActivity();
    }
}
