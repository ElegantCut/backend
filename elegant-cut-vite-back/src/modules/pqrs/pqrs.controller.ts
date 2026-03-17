import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PqrsService } from './pqrs.service';
import { CrearPqrsDto } from './dto/create-pqrs.dto';

@ApiTags('PQRS - Peticiones, Quejas, Reclamos y Sugerencias')
@Controller('pqrs') // Url base para todas las rutas de este controlador
export class PqrsController {
    constructor(private readonly pqrsService: PqrsService) { }

    @ApiOperation({ summary: 'Crear una nueva PQRS', description: 'Permite a clientes o visitantes registrar una Petición, Queja, Reclamo o Sugerencia.' })
    @ApiResponse({ status: 201, description: 'La solicitud se ha registrado exitosamente.' })
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
                stack: error instanceof Error ? error.stack : undefined
            };
        }
    }

    @ApiOperation({ summary: 'Obtener todas las PQRS', description: 'Devuelve todas las solicitudes PQRS registradas en la base de datos (Para el panel de Admin).' })
    @Get()
    async obtenerPqrs() {
        return this.pqrsService.obtenerPqrs();
    }
}
