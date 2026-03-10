import { Controller, Post, Body, Get, UseGuards, Request, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CrearUsuarioDto } from '../users/dto/create-users.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-passwors.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    async register(@Body() registerDto: CrearUsuarioDto) {
        return this.authService.register(registerDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getProfile(@Request() req) {
        return { success: true, data: req.user };
    }


    //creamos el nuevo método put

    @Put('reset-password')
    @UsePipes(new ValidationPipe())
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    // Paso 1: el usuario pide el código enviando solo su email
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.solicitarRecuperacion(email);
    }

}
