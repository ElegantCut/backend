import { Controller, Get, Post, Body } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CrearServicioDto } from './dto/create-servicio.dto';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }
    // --- MÉTODOS GET ---

    /**
     * Obtiene todos los servicios registrados.
     * Se usa un solo método para evitar conflictos de rutas y mejorar el rendimiento.
     */
    @Get()
    async getAll() {
        return this.servicesService.findAll();
    }

    @Get()
    async obtenerServicios() {
        return this.servicesService.obtenerServicios();
    }

    //metodos post

    @Post()
    async crearServicio(@Body() crearServicioDto: CrearServicioDto) {
        return this.servicesService.crearServicio(crearServicioDto);
    }
}