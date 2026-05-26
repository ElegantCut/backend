import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import * as express from 'express';

@ApiTags('Dashboard - Panel Administrativo')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Exportar estadísticas generales a PDF',
    description:
      'Genera y descarga un reporte en PDF de las estadísticas actuales.',
  })
  @Get('stats/pdf')
  async getStatsPdf(@Res() res: express.Response) {
    try {
      const pdfBuffer = await this.dashboardService.generateStatsPdf();

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Reporte_Estadisticas.pdf"',
        'Content-Length': pdfBuffer.length,
      });

      res.end(pdfBuffer);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ success: false, message: 'No se pudo generar el reporte PDF' });
    }
  }

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
