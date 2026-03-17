import { Controller, Get, Post, Body, Patch, Param, ParseIntPipe,Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CrearUsuarioDto } from './dto/create-users.dto';

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
}