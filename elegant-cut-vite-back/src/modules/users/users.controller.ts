import { Controller, Get, Post, Body, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CrearUsuarioDto } from './dto/create-users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async getAllUsers() {
        return this.usersService.obtenerTodos();
    }

    // Este es el nuevo método

    @Post()
    async crearUsuario(@Body() crearUsuarioDto: CrearUsuarioDto) {
        return this.usersService.crearUsuario(crearUsuarioDto);
    }
}