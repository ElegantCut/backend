import { Controller, Post, Body, Param, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreatePortaDto } from './dto/porta.dto';
import { PortabarberoService } from './portabarbero.service';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../modules/auth/guards/roles.guard';
import { Roles } from '../modules/auth/decorators/roles.decorator';

@ApiTags('PortaBarbero - Portafolio de Barberos')
@Controller('portabarbero')
export class PortabarberoController {
  constructor(private readonly portabarberoService: PortabarberoService) {}

  //vamos a crear el método post
  @ApiBearerAuth()
  @Roles(1, 3) // Admin y Barbero
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Crear perfil/portafolio de un barbero',
    description:
      'Registra los datos profesionales (biografía, experiencia, Instagram, fotos) de un barbero activo.',
  })
  @ApiResponse({ status: 201, description: 'Portafolio creado exitosamente.' })
  @Post()
  async crearPortafolio(@Body() createPortaDto: CreatePortaDto) {
    return await this.portabarberoService.crearPortafolio(createPortaDto);
  }

  @ApiOperation({
    summary: 'Obtener portafolio de un barbero',
    description:
      'Devuelve toda la información pública del portafolio de un barbero dado su ID de usuario.',
  })
  @ApiParam({ name: 'id', description: 'ID del usuario barbero' })
  @Get(':id')
  async getPortafolioByBarber(@Param('id') id: string) {
    return await this.portabarberoService.getPortafolioByBarber(+id);
  }
}
