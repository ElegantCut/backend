import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../modules/email/email.service';
import { LoginDto } from './dto/login.dto';
import { CrearUsuarioDto } from '../users/dto/create-users.dto';
import { ResetPasswordDto } from './dto/reset-passwors.dto';
import { codigos_verificacion_tipo } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { USER_INTEGRATION_SERVICE } from '../users/interfaces/user-integration.interface';
import type { IUserIntegration } from '../users/interfaces/user-integration.interface';
import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_INTEGRATION_SERVICE) private readonly usersService: IUserIntegration,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly authRepo: AuthRepository,
  ) { }

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
  
  /**
   * Proceso para actualizar la contraseña utilizando el código de verificación
   * enviado previamente al correo del usuario.
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, codigo, newPassword } = resetPasswordDto;

    // 1. Validar el código en la tabla codigos_verificacion
    const verificacion = await this.authRepo.findValidVerificationCode(
      email,
      codigo,
      codigos_verificacion_tipo.recuperacion
    );

    if (!verificacion) {
      throw new BadRequestException('El código es inválido o ha expirado');
    }

    // 2. Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 3. Actualizar usuario usando interface
    const user = await this.usersService.findByEmail(email);
    if (!user) {
        throw new BadRequestException('No existe un usuario con ese correo');
    }

    await this.usersService.updatePasswordByEmail(email, hashedPassword);

    // 4. Marcar código como usado
    await this.authRepo.markCodeAsUsed(verificacion.id);

    return {
      success: true,
      message: 'Contraseña actualizada correctamente',
    };
  }

  async solicitarRecuperacion(email: string) {
    let usuario;
    try {
        usuario = await this.usersService.findByEmail(email);
    } catch (e) {
        // Ignoramos si no se encuentra ( NotFoundException )
    }

    if (!usuario) {
      throw new BadRequestException('Email no registrado');
    }

    const codigoSecreto = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const fechaExpiracion = new Date();
    fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 15);

    // 4. Guardar en la tabla codigos_verificacion
    await this.authRepo.createVerificationCode({
        email: email,
        codigo: codigoSecreto,
        tipo: codigos_verificacion_tipo.recuperacion,
        expira_en: fechaExpiracion,
        usado: false,
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
      let user = await this.usersService.findByEmailOrGoogleId(email!, google_id);

      if (!user) {
        // POBALR TABLA: Si no existe, lo creamos
        user = await this.usersService.crearUsuarioConGoogle({
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
        });
      } else if (!user.google_id) {
        // Si existía por email pero no tenía google_id, lo vinculamos
        user = await this.usersService.vincularGoogleId(user.id_usuario, google_id);
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
      let user = await this.usersService.findByEmailOrGoogleId(email, '');

      if (!user) {
        user = await this.usersService.crearUsuarioConGoogle({
            email: email,
            prim_nombre: firstName || 'Usuario',
            apellido1: lastName || 'Google',
            id_rol: 2, // Rol cliente
            estado: true,
            foto_perfil: picture,
            username: (email || 'user').split('@')[0] + Math.floor(Math.random() * 1000),
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
