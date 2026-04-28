import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CrearServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Services - Servicios')
@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }
    // --- MÉTODOS GET ---

    /**
     * Obtiene todos los servicios registrados.
     * Se usa un solo método para evitar conflictos de rutas y mejorar el rendimiento.
     */
    @ApiBearerAuth()
    @Roles(1) // Solo Admin
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Obtener servicios (Admin)', description: 'Devuelve la lista con el formato específico que requiere la tabla del Dashboard.' })
    @Get('admin/all')
    async getAllAdmin() {
        return this.servicesService.findAllAdmin();
    }

    @ApiOperation({ summary: 'Obtener categorías (Admin)', description: 'Devuelve la lista de categorías con su género para el formulario de nuevo servicio.' })
    @Get('categories')
    async getCategories() {
        return this.servicesService.findAllCategories();
    }

    @ApiOperation({ summary: 'Obtener todos los servicios', description: 'Devuelve la lista completa de los servicios de barbería ofrecidos.' })
    @ApiResponse({ status: 200, description: 'Lista de servicios obtenida existosamente.' })
    @Get()
    async getAll() {
        return this.servicesService.findAll();
    }

    // async obtenerServicios() {
    //     return this.servicesService.obtenerServicios();
    // }

    @ApiOperation({ summary: 'Obtener servicios por género', description: 'Devuelve servicios asociados a caballero (1) o dama (2).' })
    @ApiParam({ name: 'generoId', description: 'ID de género (1=Caballero, 2=Dama)', example: 1 })
    @ApiResponse({ status: 200, description: 'Lista de servicios filtrada.' })
    @Get('gender/:generoId')
    async findByGender(@Param('generoId', ParseIntPipe) generoId: number) {
        return this.servicesService.findByGender(generoId);
    }

    //metodos post

    @ApiBearerAuth()
    @Roles(1) // Solo Admin
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Crear un nuevo servicio', description: 'Añade un nuevo servicio (corte, barba, etc.) al catálogo.' })
    @Post()
    async crearServicio(@Body() crearServicioDto: CrearServicioDto) {
        return this.servicesService.crearServicio(crearServicioDto);
    }

    // --- MÉTODOS CRUD ADMINISTRATIVOS ---

    @ApiOperation({ summary: 'Obtener un servicio por ID', description: 'Devuelve toda la información de un servicio específico.' })
    @ApiParam({ name: 'id', description: 'ID del servicio', example: 1 })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.findOne(id);
    }

    @ApiBearerAuth()
    @Roles(1) // Solo Admin
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Actualizar un servicio (Admin)', description: 'Permite modificar precio, nombre, duración, etc.' })
    @ApiParam({ name: 'id', description: 'ID del servicio a editar', example: 1 })
    @ApiResponse({ status: 200, description: 'Servicio actualizado exitosamente.' })
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateServicioDto: UpdateServicioDto) {
        return this.servicesService.update(id, updateServicioDto);
    }

    @ApiBearerAuth()
    @Roles(1) // Solo Admin
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Eliminar un servicio (Admin)', description: 'Borra de manera definitiva un servicio del catálogo.' })
    @ApiParam({ name: 'id', description: 'ID del servicio a eliminar', example: 1 })
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.servicesService.remove(id);
    }
}