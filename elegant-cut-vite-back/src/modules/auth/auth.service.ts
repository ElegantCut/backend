import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../modules/users/users.service';
import { EmailService } from '../../modules/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CrearUsuarioDto } from '../users/dto/create-users.dto';
import { ResetPasswordDto } from './dto/reset-passwors.dto';
import { codigos_verificacion_tipo } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    private prisma: PrismaService,
  ) {}

  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  async login(loginDto: LoginDto) {
    const { username, contrasena } = loginDto;
    const user = await this.usersService.findOneByUsername(username);

    // Validar si el usuario está activo
    if (!user.estado) {
      throw new UnauthorizedException(
        'Tu cuenta está desactivada. Por favor, contacta al administrador.',
      );
    }

    const isMatch = await this.usersService.comparePassword(
      contrasena,
      user.password_hash ?? '',
    );
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    let role = user.rol?.nombre_rol
      ? user.rol.nombre_rol.toLowerCase()
      : 'cliente';
    if (role === 'administrador') role = 'admin';
    if (role === 'barbero') role = 'barber';

    const payload = {
      id: user.id_usuario,
      id_usuario: user.id_usuario,
      username: user.username,
      email: user.email,
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
        id_usuario: user.id_usuario,
        username: user.username,
        email: user.email,
        name: `${user.prim_nombre} ${user.apellido1}`,
        role: role,
        id_rol: user.id_rol,
        userId: user.id_usuario,
      },
    };
  }

  async register(registerDto: CrearUsuarioDto) {
    const user = await this.usersService.crearUsuario({
      ...registerDto,
      id_rol: registerDto.id_rol || 2,
    });

    return {
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        id_usuario: user.id_usuario,
        username: user.username,
        email: user.email,
        name: `${user.prim_nombre} ${user.apellido1}`,
        role: 'cliente',
        id_rol: user.id_rol,
        userId: user.id_usuario,
      },
    };
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

    // 3. Transacción: Actualizar usuarios y marcar código como usado
    return await this.prisma.$transaction(async (tx) => {
      const usuarios = await tx.usuarios.findMany({ where: { email } });
      if (usuarios.length === 0)
        throw new BadRequestException('No existe un usuario con ese correo');

      await tx.usuarios.updateMany({
        where: { email },
        data: { password_hash: hashedPassword },
      });

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

  async solicitarRecuperacion(email: string) {
    const usuario = await this.prisma.usuarios.findFirst({ where: { email } });

    if (!usuario) {
      return {
        message: 'Si el correo existe en nuestro sistema, recibirás un código.',
      };
    }

    const codigoSecreto = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

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

    await this.emailService.sendVerificationCode(email, codigoSecreto);

    return { message: 'Se ha enviado un código a tu correo.' };
  }

  async googleLogin(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) throw new BadRequestException('Token de Google inválido');

      const {
        email,
        sub: google_id,
        given_name,
        family_name,
        picture,
      } = payload;

      // Buscar usuario por email o google_id
      let user = await this.prisma.usuarios.findFirst({
        where: {
          OR: [{ email: email }, { google_id: google_id }],
        },
        include: { rol: true },
      });

      if (!user) {
        // POBALR TABLA: Si no existe, lo creamos
        user = await this.prisma.usuarios.create({
          data: {
            email: email!,
            google_id: google_id,
            prim_nombre: given_name || 'Usuario',
            apellido1: family_name || 'Google',
            id_rol: 2, // Rol cliente
            estado: true,
            foto_perfil: picture,
            username:
              (email || 'user').split('@')[0] +
              Math.floor(Math.random() * 1000),
          },
          include: { rol: true },
        });
      } else if (!user.google_id) {
        // Si existía por email pero no tenía google_id, lo vinculamos
        user = await this.prisma.usuarios.update({
          where: { id_usuario: user.id_usuario },
          data: { google_id: google_id },
          include: { rol: true },
        });
      }

      // Generar payload para nuestro JWT
      let role = user.rol?.nombre_rol
        ? user.rol.nombre_rol.toLowerCase()
        : 'cliente';
      if (role === 'administrador') role = 'admin';
      if (role === 'barbero') role = 'barber';

      const jwtPayload = {
        id: user.id_usuario,
        id_usuario: user.id_usuario,
        username: user.username,
        email: user.email,
        name: `${user.prim_nombre} ${user.apellido1}`,
        role: role,
        id_rol: user.id_rol,
        userId: user.id_usuario,
      };

      return {
        success: true,
        message: 'Login con Google exitoso',
        token: this.jwtService.sign(jwtPayload),
        user: {
          id_usuario: user.id_usuario,
          username: user.username,
          email: user.email,
          name: `${user.prim_nombre} ${user.apellido1}`,
          role: role,
          id_rol: user.id_rol,
          userId: user.id_usuario,
        },
      };
    } catch (error) {
      console.error('Error en Google Login:', error);
      throw new UnauthorizedException('Error al validar con Google');
    }
  }

  async googleLoginServerSide(reqUser: any) {
    try {
      if (!reqUser) throw new BadRequestException('Usuario de Google no proporcionado');

      const { email, firstName, lastName, picture } = reqUser;

      // Buscar usuario por email
      let user = await this.prisma.usuarios.findFirst({
        where: { email: email },
        include: { rol: true },
      });

      if (!user) {
        user = await this.prisma.usuarios.create({
          data: {
            email: email,
            prim_nombre: firstName || 'Usuario',
            apellido1: lastName || 'Google',
            id_rol: 2, // Rol cliente
            estado: true,
            foto_perfil: picture,
            username: (email || 'user').split('@')[0] + Math.floor(Math.random() * 1000),
          },
          include: { rol: true },
        });
      }

      let role = user.rol?.nombre_rol ? user.rol.nombre_rol.toLowerCase() : 'cliente';
      if (role === 'administrador') role = 'admin';
      if (role === 'barbero') role = 'barber';

      const jwtPayload = {
        id: user.id_usuario,
        id_usuario: user.id_usuario,
        username: user.username,
        email: user.email,
        name: `${user.prim_nombre} ${user.apellido1}`,
        role: role,
        id_rol: user.id_rol,
        userId: user.id_usuario,
      };

      return {
        success: true,
        message: 'Login con Google exitoso',
        token: this.jwtService.sign(jwtPayload),
        user: {
          id_usuario: user.id_usuario,
          username: user.username,
          email: user.email,
          name: `${user.prim_nombre} ${user.apellido1}`,
          role: role,
          id_rol: user.id_rol,
          userId: user.id_usuario,
        },
      };
    } catch (error) {
      console.error('Error en Google Login Server Side:', error);
      throw new UnauthorizedException('Error al registrar/logear con Google');
    }
  }

  async validateToken(user: any) {
    return {
      statusCode: 200,
      message: 'Token validado exitosamente',
      user: {
        id_usuario: user.id_usuario,
        username: user.username,
        email: user.email,
        id_rol: user.id_rol,
        role: user.role,
        name: user.name,
        userId: user.id_usuario,
      },
    };
  }
}
