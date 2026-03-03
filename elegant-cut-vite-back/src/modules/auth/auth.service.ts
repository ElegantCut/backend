import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../modules/users/users.service';
import { EmailService } from '../../modules/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CrearUsuarioDto } from '../users/dto/create-users.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService,
        private prisma: PrismaService,
    ) { }

    async login(loginDto: LoginDto) {
        const { username, contrasena } = loginDto;
        const user = await this.usersService.findOneByUsername(username);

        const isMatch = await this.usersService.comparePassword(contrasena, user.password_hash ?? '');
        if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

        // Normalización de roles para el frontend
        let role = user.rol?.nombre_rol ? user.rol.nombre_rol.toLowerCase() : 'cliente';
        if (role === 'administrador') role = 'admin';
        if (role === 'barbero') role = 'barber';

        const payload = {
            id: user.id_usuario,
            username: user.username,
            name: `${user.prim_nombre} ${user.apellido1}`,
            role: role,
            id_rol: user.id_rol,
            userId: user.id_usuario,
        };

        return {
            success: true,
            message: 'Login exitoso',
            token: this.jwtService.sign(payload),
            user: {
                username: user.username,
                name: `${user.prim_nombre} ${user.apellido1}`,
                role: role,
                userId: user.id_usuario,
            },
        };
    }

    async register(registerDto: CrearUsuarioDto) {
        // Encriptar contraseña antes de guardar
        const password_hash = await this.usersService.hashPassword(registerDto.password_hash);

        return await this.usersService.crearUsuario({
            ...registerDto,
            password_hash,
            id_rol: registerDto.id_rol || 2 // 2 = Cliente normal por defecto si no se envía
        });
    }

    async traerUsuarios() {
        return await this.usersService.obtenerTodos();
    }
}
