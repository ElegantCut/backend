import { Body, Controller, Get, Param, Post, Put, Patch, Delete, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BarbersService } from './barbers.service';
import { CreateBarberDto } from './dto/create.barbers.dto';
import { UpdateBarberDto } from './dto/update.barbers.dto';

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
    @Get('all')
    async getAllBarbers() {
        return this.barbersService.getAllBarbers();
    }

    @ApiOperation({ summary: 'Obtener estadísticas de un barbero', description: 'Devuelve datos de citas, reseñas, ingresos, etc. del barbero especificado (Ideal para el dashboard).' })
    @ApiParam({ name: 'id', description: 'ID del barbero' })
    @Get(':id/stats')
    async getStats(@Param('id') id: string) {
        return this.barbersService.getBarberStats(+id);
    }

    //acá definimos y creamos el post para crear el barbero
    @ApiOperation({ summary: 'Crear un nuevo barbero', description: 'Registra un nuevo usuario con el rol 3 (Barbero) y encripta su contraseña.' })
    @ApiResponse({ status: 201, description: 'Barbero creado exitosamente.' })
    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async crearBarbero(@Body() createBarberDto: CreateBarberDto, @UploadedFile() image: Express.Multer.File) {
        try {
            // Lógica normal, pasamos los datos del FormData (que ahora son strings)
            await this.barbersService.crearBarbero(createBarberDto);
            return { success: true, message: 'Barbero creado correctamente' };
        } catch (error) {
            console.error(error);
            return { success: false, message: 'Error interno al crear el barbero' };
        }
    }

    // --- MÉTODOS CRUD ADMINISTRATIVOS ---

    @ApiOperation({ summary: 'Obtener un barbero por ID', description: 'Devuelve información de un barbero específico, incluyendo portafolio y servicios asignados.' })
    @ApiParam({ name: 'id', description: 'ID del barbero', example: 1 })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.barbersService.findOne(id);
    }

    @ApiOperation({ summary: 'Alternar estado del barbero', description: 'Activa o desactiva (estado true/false) el barbero indicado.' })
    @ApiParam({ name: 'id', description: 'ID del barbero' })
    @Put(':id/toggle')
    async toggleStatus(@Param('id', ParseIntPipe) id: number) {
        return this.barbersService.toggleStatus(id);
    }

    @ApiOperation({ summary: 'Actualizar datos de barbero (Admin)', description: 'Permite modificar cualquier dato de un barbero.' })
    @ApiParam({ name: 'id', description: 'ID del barbero a editar', example: 1 })
    @ApiResponse({ status: 200, description: 'Barbero actualizado exitosamente.' })
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateBarberDto: UpdateBarberDto) {
        return this.barbersService.update(id, updateBarberDto);
    }

    @ApiOperation({ summary: 'Desactivar/Eliminar barbero (Admin)', description: 'Borrado suave: Cambia el estado del barbero a inactivo.' })
    @ApiParam({ name: 'id', description: 'ID del barbero a desactivar', example: 1 })
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.barbersService.remove(id);
    }
}
