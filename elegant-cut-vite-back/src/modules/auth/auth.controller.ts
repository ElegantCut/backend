import { Controller, Post, Body, Get, UseGuards, Request, Put, UsePipes, ValidationPipe, Res } from '@nestjs/common';
import type { Response } from 'express'; // Importamos Response para poder trabajar con las cookies
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CrearUsuarioDto } from '../users/dto/create-users.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-passwors.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // importa el guard que creamos

@ApiTags('Auth - Autenticación')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    //protegemos la ruta de login con el guard
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Verificar Token', description: 'Verifica si el token JWT actual es válido y devuelve los datos del usuario.' })
    @UseGuards(JwtAuthGuard)
    @Post('check-token')
    async checkToken(@Request() req) {
        return this.authService.validateToken(req.user);
    }

    @ApiOperation({ summary: 'Iniciar Sesión', description: 'Inicia sesión con de usuario y contraseña para obtener un token JWT.' })
    @ApiResponse({ status: 201, description: 'Inicio de sesión exitoso, retorna el token.' })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const result = await this.authService.login(loginDto);
        res.cookie('jwt', result.token, {
            httpOnly: true,
            secure: false, // Debe ser false para http://localhost
            sameSite: 'lax', 
            path: '/',
            maxAge: 24 * 60 * 60 * 1000,
        });
        // Retornamos el resultado completo incluyendo el token
        // El frontend usa la cookie automáticamente, y Swagger puede ver el token en la respuesta
        return result;
    }

    @ApiOperation({ summary: 'Registrar nuevo usuario', description: 'Registra a un nuevo usuario cliente en la plataforma.' })
    @Post('register')
    async register(@Body() registerDto: CrearUsuarioDto) {
        return this.authService.register(registerDto);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener mi perfil', description: 'Devuelve los detalles básicos del usuario que está conectado (según el token).' })
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Request() req) {
        return { success: true, data: req.user };
    }


    //creamos el nuevo método put

    @ApiOperation({ summary: 'Restablecer Contraseña' })
    @Put('reset-password')
    @UsePipes(new ValidationPipe())
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    //  codigo de recuperacion de correo se hace con el método post
    @ApiOperation({ summary: 'Solicitar recuperación de contraseña (Olvidé mi contraseña)' })
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.solicitarRecuperacion(email);
    }

    @ApiOperation({ summary: 'Cerrar Sesión', description: 'Elimina la cookie de autenticación del usuario.' })
    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jwt');
        return { success: true, message: 'Sesión cerrada correctamente' };
    }

}
