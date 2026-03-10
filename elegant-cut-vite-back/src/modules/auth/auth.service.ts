import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../modules/users/users.service';
import { EmailService } from '../../modules/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CrearUsuarioDto } from '../users/dto/create-users.dto';
import { ResetPasswordDto } from './dto/reset-passwors.dto';
import { codigos_verificacion_tipo } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
        const password_hash = await this.usersService.hashPassword(registerDto.password_hash);

        return await this.usersService.crearUsuario({
            ...registerDto,
            password_hash,
            id_rol: registerDto.id_rol || 2
        });
    }

    async traerUsuarios() {
        return await this.usersService.obtenerTodos();
    }

    /**
     * Proceso para actualizar la contraseña utilizando el código de verificación
     * enviado previamente al correo del usuario.
     */
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { email, codigo, newPassword } = resetPasswordDto;

        // 1. Validar el código en la tabla codigos_verificacion
        const verificacion = await this.prisma.codigos_verificacion.findFirst({
            where: {
                email: email,
                codigo: codigo,
                tipo: codigos_verificacion_tipo.recuperacion,
                usado: false,
                expira_en: { gte: new Date() }, // Verifica que no haya expirado
            },
        });

        if (!verificacion) {
            throw new BadRequestException('El código es inválido o ha expirado');
        }

        // 2. Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 3. Transacción: Actualizar usuario y marcar código como usado
        // Usamos una transacción para asegurar que ambas cosas pasen o ninguna
        return await this.prisma.$transaction(async (tx) => {
            // Buscar el usuario por email para obtener su id (email no es @unique en Prisma)
            const usuario = await tx.usuarios.findFirst({ where: { email } });
            if (!usuario) throw new BadRequestException('No existe un usuario con ese correo');

            // Actualizar la contraseña usando la clave primaria id_usuario
            const usuarioActualizado = await tx.usuarios.update({
                where: { id_usuario: usuario.id_usuario },
                data: { password_hash: hashedPassword },
            });

            // Marcar el código como utilizado para que no se pueda reusar
            await tx.codigos_verificacion.update({
                where: { id: verificacion.id },
                data: { usado: true },
            });

            return {
                success: true,
                message: 'Contraseña actualizada correctamente',
            };
        });
    }

    /**
     * Paso 1 del flujo: el usuario pide un código para recuperar su contraseña.
     * Genera el código, lo guarda en DB y lo envía al correo.
     */
    async solicitarRecuperacion(email: string) {
        // 1. Verificar que el usuario exista
        const usuario = await this.prisma.usuarios.findFirst({ where: { email } });

        if (!usuario) {
            // Por seguridad devolvemos siempre el mismo mensaje (no revelamos si el email existe)
            return { message: 'Si el correo existe en nuestro sistema, recibirás un código.' };
        }

        // 2. Generar código aleatorio de 6 dígitos
        const codigoSecreto = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Definir expiración: 15 minutos desde ahora
        const fechaExpiracion = new Date();
        fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);

        // 4. Guardar en la tabla codigos_verificacion
        await this.prisma.codigos_verificacion.create({
            data: {
                email: email,
                codigo: codigoSecreto,
                tipo: codigos_verificacion_tipo.recuperacion,
                expira_en: fechaExpiracion,
                usado: false,
            },
        });

        // 5. Enviar el código por correo usando el EmailService existente
        await this.emailService.sendVerificationCode(email, codigoSecreto);

        return { message: 'Se ha enviado un código a tu correo.' };
    }
}
