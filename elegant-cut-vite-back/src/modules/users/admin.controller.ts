import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Admin - Administradores')
@Controller('admin')
export class AdminController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Obtener administradores', description: 'Listado completo de administradores para el panel de administración.' })
    @Get('administrators')
    async getAdministrators() {
        return this.usersService.findAllAdmins();
    }
}
