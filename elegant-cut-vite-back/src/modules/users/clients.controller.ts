import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';

@ApiTags('Clients - Clientes')
@Controller('clients')
export class ClientsController {
  constructor(private readonly usersService: UsersService) { }
  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener clientes',
    description:
      'Listado completo de clientes activos (rol 2) para el panel de administración.',
  })
  @Get()
  async getClients() {
    return this.usersService.findAllClients();
  }
  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Desactivar cliente',
    description:
      'Realiza un borrado lógico (estado: false) de un cliente específico.',
  })
  @Delete(':id')
  async deactivateClient(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deactivateClient(id);
  }
  @ApiBearerAuth()
  @Roles(1) // Solo Admin
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Activar cliente',
    description: 'Activa la cuenta de un cliente previamente desactivado.',
  })
  @Patch(':id/activate')
  async activateClient(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.activateClient(id);
  }
}
