import {
  Body,
  Controller,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BarbersService } from './barbers.service';
import { CreateBarberDto } from './dto/create.barbers.dto';
import { UpdateBarberDto } from './dto/update.barbers.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

// ─── SOLID: SRP ───────────────────────────────────────────────────────────────
// Este controlador tiene UNA sola responsabilidad: gestión administrativa
// de barberos. El guard y el rol se aplican a NIVEL DE CLASE, eliminando
// la redundancia de decorar cada endpoint individualmente (DRY Principle).
// ──────────────────────────────────────────────────────────────────────────────
@ApiTags('Barbers - Administración')
@ApiBearerAuth()
@Roles(1) // Solo Admin
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('barbers')
export class BarbersAdminController {
  constructor(private readonly barbersService: BarbersService) {}

  @ApiOperation({ summary: 'Obtener todos los barberos (Admin)' })
  @ApiOperation({
    description:
      'Solo para administradores. Devuelve todos los barberos con toda su información, incluyendo los inactivos.',
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async crearBarbero(
    @Body() createBarberDto: CreateBarberDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    try {
      await this.barbersService.crearBarbero(createBarberDto);
      return { success: true, message: 'Barbero creado correctamente' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Error interno al crear el barbero' };
    }
  }

  @ApiOperation({ summary: 'Alternar estado del barbero' })
  @ApiParam({ name: 'id', description: 'ID del barbero' })
  @Put(':id/toggle')
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.barbersService.toggleStatus(id);
  }

  @ApiOperation({ summary: 'Actualizar datos de barbero (Admin)' })
  @ApiParam({ name: 'id', description: 'ID del barbero a editar', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Barbero actualizado exitosamente.',
  })
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBarberDto: UpdateBarberDto,
  ) {
    return this.barbersService.update(id, updateBarberDto);
  }

  @ApiOperation({ summary: 'Desactivar/Eliminar barbero (Admin)' })
  @ApiParam({
    name: 'id',
    description: 'ID del barbero a desactivar',
    example: 1,
  })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.barbersService.remove(id);
  }
}
