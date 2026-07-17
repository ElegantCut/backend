import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CrearUsuarioDto } from './dto/create-users.dto';
import { UpdateUsuarioDto } from './dto/update-users.dto';

@ApiTags('Admin - Administradores')
@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) { }
  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener administradores',
    description:
      'Listado completo de administradores para el panel de administración.',
  })
  @Get('administrators')
  async getAdministrators() {
    return this.usersService.findAllAdmins();
  }
  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Crear nuevo administrador' })
  @Post('administrators')
  async createAdmin(@Body() data: CrearUsuarioDto) {
    // Forzamos que el rol sea 1 (Admin)
    return this.usersService.crearUsuario({
      ...data,
      id_rol: 1,
    });
  }
  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Actualizar administrador' })
  @Patch('administrators/:id')
  async updateAdmin(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUsuarioDto) {
    return this.usersService.update(id, data);
  }
  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Cambiar estado del administrador' })
  @Put('administrators/:id/toggle')
  async toggleStatus(@Param('id', ParseIntPipe) id: number) {
    const admin = await this.usersService.findOne(id);
    const newStatus = !admin.estado;
    return this.usersService.update(id, { estado: newStatus });
  }
}
