import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe,Request, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CrearUsuarioDto } from './dto/create-users.dto';
import { UpdateUsuarioDto } from './dto/update-users.dto';

@ApiTags('Users - Usuarios')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @ApiOperation({ summary: 'Obtener todos los usuarios', description: 'Devuelve una lista con todos los usuarios registrados en el sistema.' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios obtenida exitosamente.' })
    @Get()
    async getAllUsers() {
        return this.usersService.obtenerTodos();
    }

    // Este es el nuevo método

    @ApiOperation({ summary: 'Crear un nuevo usuario', description: 'Crea un usuario en la base de datos a partir de los datos proporcionados.' })
    @ApiResponse({ status: 201, description: 'El usuario ha sido creado con éxito.' })
    @ApiResponse({ status: 400, description: 'Datos inválidos.' })
    @Post()
    async crearUsuario(@Body() crearUsuarioDto: CrearUsuarioDto) {
        return this.usersService.crearUsuario(crearUsuarioDto);
    }

    // hacemos el patch update
    @ApiOperation({ summary: 'Actualizar foto de perfil', description: 'Actualiza o asigna la foto de perfil en Cloudinary a un usuario específico por su ID.' })
    @ApiParam({ name: 'id', description: 'ID del usuario a actualizar', type: Number })
    @ApiBody({ schema: { type: 'object', properties: { public_id: { type: 'string', example: 'elegant-cut/users/foto123' } } } })
    @ApiResponse({ status: 200, description: 'Foto actualizada exitosamente.' })
    @Patch('update-photo/:id')
    async updatePhoto(
        @Param('id', ParseIntPipe) id: number,
        @Body('public_id') publicId: string

    ){
        return await this.usersService.updatePhoto(id,publicId);
    }

    // --- MÉTODOS CRUD ADMINISTRATIVOS ---

    @ApiOperation({ summary: 'Obtener un usuario por ID', description: 'Devuelve información detallada de un usuario específico.' })
    @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @ApiOperation({ summary: 'Obtener estadísticas de un usuario', description: 'Devuelve citas, promedio y puntos para la vista del perfil.' })
    @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
    @ApiResponse({ status: 200, description: 'Estadísticas obtenidas existosamente.' })
    @Get(':id/stats')
    async getStats(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getUserStats(id);
    }

    @ApiOperation({ summary: 'Obtener notificaciones de un usuario', description: 'Devuelve un historial de alertas sobre el estado de las citas.' })
    @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
    @ApiResponse({ status: 200, description: 'Notificaciones obtenidas existosamente.' })
    @Get(':id/notifications')
    async getNotifications(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getUserNotifications(id);
    }

    @ApiOperation({ summary: 'Obtener historial de citas de usuario', description: 'Devuelve citas activas y el historial de citas pasadas/canceladas.' })
    @ApiParam({ name: 'id', description: 'ID del usuario', example: 1 })
    @ApiResponse({ status: 200, description: 'Citas obtenidas existosamente.' })
    @Get(':id/appointments')
    async getAppointments(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.getUserAppointments(id);
    }

    @ApiOperation({ summary: 'Actualizar datos de usuario (Admin)', description: 'Permite modificar cualquier dato de un usuario (nombre, rol, estado, etc.)' })
    @ApiParam({ name: 'id', description: 'ID del usuario a editar', example: 1 })
    @ApiResponse({ status: 200, description: 'Usuario actualizado existosamente.' })
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
        return this.usersService.update(id, updateUsuarioDto);
    }

    @ApiOperation({ summary: 'Desactivar/Eliminar usuario (Admin)', description: 'Borrado suave: Cambia el estado del usuario a inactivo en vez de borrarlo permanentemente para no afectar las relaciones de la BD.' })
    @ApiParam({ name: 'id', description: 'ID del usuario a desactivar', example: 1 })
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.remove(id);
    }
}