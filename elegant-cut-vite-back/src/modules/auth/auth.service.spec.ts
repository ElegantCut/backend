import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../modules/email/email.service';
import { AuthRepository } from './auth.repository';
import { USER_INTEGRATION_SERVICE } from '../users/interfaces/user-integration.interface';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService - Pruebas Unitarias Iniciales', () => {
    let service: AuthService;
    let mockUsersService: any;

    beforeEach(async () => {
        mockUsersService = {
            findOneByUsername: jest.fn(),
            comparePassword: jest.fn(),
        };

        const mockJwtService = { sign: jest.fn().mockReturnValue('token-falso-123') };
        const mockEmailService = { sendVerificationCode: jest.fn() };
        const mockAuthRepo = { findValidVerificationCode: jest.fn() };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: USER_INTEGRATION_SERVICE, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
                { provide: EmailService, useValue: mockEmailService },
                { provide: AuthRepository, useValue: mockAuthRepo },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });


    it('el servicio de autenticacion debe estar definido', () => {
        expect(service).toBeDefined();
    });


    it('Debe arrojar "Contraseña incorrecta" si la contraseña no coincide', async () => {
        mockUsersService.findOneByUsername.mockResolvedValue({
            id_usuario: 1,
            username: 'pal@gmail.com',
            estado: true,
            password_hash: '123'
        });
        mockUsersService.comparePassword.mockResolvedValue(false);

        const datosDeLogin = { username: 'pal@gmail.com', contrasena: 'clave_MALA' };
        await expect(service.login(datosDeLogin)).rejects.toThrow('Contraseña incorrecta');
    });


    it('Debe iniciar sesión exitosamente y devolver un token si los datos son correctos', async () => {
        mockUsersService.findOneByUsername.mockResolvedValue({
            id_usuario: 1,
            username: 'pal@gmail.com',
            estado: true,
            password_hash: '123',
            rol: { nombre_rol: 'cliente' }
        });
        mockUsersService.comparePassword.mockResolvedValue(true);

        const datosDeLogin = { username: 'pal@gmail.com', contrasena: '123' };
        const resultado = await service.login(datosDeLogin);

        expect(resultado.success).toBe(true);
        expect(resultado.message).toBe('Login exitoso');
        expect(resultado.token).toBe('token-falso-123');
    });


});
