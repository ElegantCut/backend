import { Controller, Get, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Clients - Clientes')
@Controller('clients')
export class ClientsController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Obtener clientes', description: 'Listado completo de clientes activos (rol 2) para el panel de administración.' })
    @Get()
    async getClients() {
        return this.usersService.findAllClients();
    }

    @ApiOperation({ summary: 'Desactivar cliente', description: 'Realiza un borrado lógico (estado: false) de un cliente específico.' })
    @Delete(':id')
    async deactivateClient(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.deactivateClient(id);
    }

    @ApiOperation({ summary: 'Activar cliente', description: 'Activa la cuenta de un cliente previamente desactivado.' })
    @Patch(':id/activate')
    async activateClient(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.activateClient(id);
    }
}
