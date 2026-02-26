import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../modules/users/users.service';
import { EmailService } from '../../modules/email/email.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private emailService: EmailService,
    ) { }

    async login(loginDto: any) {
        const { username, password } = loginDto;
        const user = await this.usersService.findOneByUsername(username);

        const isMatch = await this.usersService.comparePassword(password, user.password_hash ?? '');
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

    async register(registerDto: any) {
        // Implementar lógica de registro similar al controller de Express
        // Usando UsersService para crear el usuario
        return { message: 'Registro pendiente de implementación detallada' };
    }
}
