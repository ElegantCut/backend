import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CrearServicioDto } from './dto/create-servicio.dto';

@ApiTags('Services - Servicios')
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }
    // --- MÉTODOS GET ---

    /**
     * Obtiene todos los servicios registrados.
     * Se usa un solo método para evitar conflictos de rutas y mejorar el rendimiento.
     */
    @ApiOperation({ summary: 'Obtener todos los servicios', description: 'Devuelve la lista completa de los servicios de barbería ofrecidos.' })
    @ApiResponse({ status: 200, description: 'Lista de servicios obtenida existosamente.' })
    @Get()
    async getAll() {
        return this.servicesService.findAll();
    }

    // @Get() // METODO DUPLICADO COMENTADO
    // async obtenerServicios() {
    //     return this.servicesService.obtenerServicios();
    // }

    //metodos post

    @ApiOperation({ summary: 'Crear un nuevo servicio', description: 'Añade un nuevo servicio (corte, barba, etc.) al catálogo.' })
    @Post()
    async crearServicio(@Body() crearServicioDto: CrearServicioDto) {
        return this.servicesService.crearServicio(crearServicioDto);
    }
}