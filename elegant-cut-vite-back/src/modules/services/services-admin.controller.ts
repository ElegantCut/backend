import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CrearServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// ─── SOLID: SRP ───────────────────────────────────────────────────────────────
// Este controlador tiene UNA sola responsabilidad: gestión administrativa
// del catálogo de servicios. Los guards se aplican a NIVEL DE CLASE.
// ──────────────────────────────────────────────────────────────────────────────
@ApiTags('Services - Administración')
@ApiBearerAuth()
@Roles(1) // Solo Admin
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServicesAdminController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiOperation({
    summary: 'Obtener servicios (Admin)',
    description: 'Devuelve la lista para la tabla del Dashboard del Admin.',
  })
  @Get('admin/all')
  async getAllAdmin() {
    return this.servicesService.findAllAdmin();
  }

  @ApiOperation({
    summary: 'Crear un nuevo servicio',
    description: 'Añade un nuevo servicio (corte, barba, etc.) al catálogo.',
  })
  @ApiResponse({ status: 201, description: 'Servicio creado exitosamente.' })
  @Post()
  async crearServicio(@Body() crearServicioDto: CrearServicioDto) {
    return this.servicesService.crearServicio(crearServicioDto);
  }

  @ApiOperation({
    summary: 'Actualizar un servicio (Admin)',
    description: 'Permite modificar precio, nombre, duración, etc.',
  })
  @ApiParam({ name: 'id', description: 'ID del servicio a editar', example: 1 })
  @ApiResponse({ status: 200, description: 'Servicio actualizado exitosamente.' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateServicioDto: UpdateServicioDto,
  ) {
    return this.servicesService.update(id, updateServicioDto);
  }

  @ApiOperation({
    summary: 'Eliminar un servicio (Admin)',
    description: 'Borra definitivamente un servicio del catálogo.',
  })
  @ApiParam({ name: 'id', description: 'ID del servicio a eliminar', example: 1 })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.servicesService.remove(id);
  }
}
