import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BarbersService } from './barbers.service';
import { CreateBarberDto } from './dto/create.barbers.dto';

@ApiTags('Barbers - Barberos')
@Controller('barbers')
export class BarbersController {
    constructor(private readonly barbersService: BarbersService) { }

    @ApiOperation({ summary: 'Obtener barberos según el rol de quien consulta', description: 'Si es cliente/público, devuelve barberos activos sin datos sensibles. Si es admin, devuelve todos los detalles.' })
    @ApiResponse({ status: 200, description: 'Lista de barberos obtenida.' })
    @Get()
    async obtenerBarberos() {
        return this.barbersService.obtenerBarberos();
    }

    @ApiOperation({ summary: 'Obtener barberos públicos', description: 'Devuelve información pública de los barberos para mostrar a los clientes en la plataforma (vista tarjeta).' })
    @ApiResponse({ status: 200, description: 'Barberos públicos obtenidos correctamente.' })
    @Get('public')
    async getPublicBarbers() {
        return this.barbersService.getPublicBarbers();
    }

    @ApiOperation({ summary: 'Obtener todos los barberos (Admin)', description: 'Solo para administradores, devuelve todos los barberos con toda su información, incluyendo los inactivos.' })
    @Get('admin/all')
    async getAllForAdmin() {
        return this.barbersService.getAllBarbers();
    }

    @ApiOperation({ summary: 'Obtener estadísticas de un barbero', description: 'Devuelve datos de citas, reseñas, ingresos, etc. del barbero especificado (Ideal para el dashboard).' })
    @ApiParam({ name: 'id', description: 'ID del barbero' })
    @Get(':id/stats')
    async getStats(@Param('id') id: string) {
        return this.barbersService.getBarberStats(+id);
    }

    //acá definimos y creamos el post para crear el barbero

    @ApiOperation({ summary: 'Crear un nuevo barbero', description: 'Registra un nuevo usuario con rol de barbero en la base de datos.' })
    @ApiResponse({ status: 201, description: 'Barbero creado exitosamente.' })
    @Post()
    async crearBarbero(@Body() createBarberDto: CreateBarberDto) {
        return this.barbersService.crearBarbero(createBarberDto);
    }
}
