import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { PqrsService } from './pqrs.service';
import { CrearPqrsDto } from './dto/create-pqrs.dto';

@Controller('pqrs') // Url base para todas las rutas de este controlador
export class PqrsController {
    constructor(private readonly pqrsService: PqrsService) { }

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

    @Get()
    async obtenerPqrs() {
        return this.pqrsService.obtenerPqrs();
    }
}
