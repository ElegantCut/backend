import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PqrsService } from './pqrs.service';
import { CrearPqrsDto } from './dto/create-pqrs.dto';
import { UpdatePqrsDto } from './dto/update-pqrs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('PQRS - Peticiones, Quejas, Reclamos y Sugerencias')
@Controller('pqrs') // Url base para todas las rutas de este controlador
export class PqrsController {
  constructor(private readonly pqrsService: PqrsService) {}

  @ApiOperation({
    summary: 'Crear una nueva PQRS',
    description:
      'Permite a clientes o visitantes registrar una Petición, Queja, Reclamo o Sugerencia.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: 201,
    description: 'La solicitud se ha registrado exitosamente.',
  })
  @ApiNotFoundResponse({ description: 'Error al crear la pqrs' })
  @Post()
  async crearPqrs(@Body() crearPqrsDto: CrearPqrsDto) {
    try {
      return await this.pqrsService.create(crearPqrsDto);
    } catch (error) {
      console.error('Error creando PQRS:', error);
      return {
        statusCode: 500,
        message: 'Internal server error',
        errorDetail: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      };
    }
  }

  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener todas las PQRS',
    description:
      'Devuelve todas las solicitudes PQRS registradas en la base de datos (Para el panel de Admin).',
  })
  @ApiResponse({ status: 200, description: 'PQRS encontrada exitosamente' })
  @ApiNotFoundResponse({
    description: 'No se encontro la PQRS con el ID proporcionado',
  })
  @Get()
  async obtenerPqrs() {
    return this.pqrsService.obtenerPqrs();
  }

  @ApiOperation({
    summary: 'Consultar estado por radicado',
    description:
      'Permite buscar el estado de una PQRS usando su código de radicado (ej: PQRS-12-2024).',
  })
  @ApiParam({
    name: 'radicado',
    description: 'Número de radicado',
    example: 'PQRS-1-2026',
  })
  @Get('status/:radicado')
  async findByRadicado(@Param('radicado') radicado: string) {
    return this.pqrsService.findByRadicado(radicado);
  }

  // --- MÉTODOS CRUD ADMINISTRATIVOS ---
  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener detalle de una queja o reclamo',
    description:
      'Devuelve toda la información de una PQRS específica incluyendo datos del usuario asociado.',
  })
  @ApiParam({ name: 'id', description: 'ID de la PQRS', example: 1 })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pqrsService.findOne(id);
  }

  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Responder y/o actualizar una PQRS',
    description:
      'Permite al administrador enviar la respuesta o cambiar el estado de la queja de Pendiente a Resuelto.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la PQRS a responder',
    example: 1,
  })
  @ApiResponse({ status: 200, description: 'PQRS actualizada exitosamente.' })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePqrsDto: UpdatePqrsDto,
  ) {
    return this.pqrsService.update(id, updatePqrsDto);
  }
}
