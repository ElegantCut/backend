import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../modules/email/email.service';
import { AuthRepository } from './auth.repository';
import { USER_INTEGRATION_SERVICE } from '../users/interfaces/user-integration.interface';
import { UnauthorizedException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CrearUsuarioDto } from '../users/dto/create-users.dto';

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


    //desde aquí es la programaciond de las pruebas que se van a hacer acorde a las hu


    //este fue una prueba
    it('el servicio de autenticacion debe estar definido', () => {
        expect(service).toBeDefined();
    });


    //este fue una prueba que no se pudo realizar ya que al compilar dava error
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


    it('Debe rechazar el registro si el nombre contiene caracyeres especialesy números(112, @,$,#)', async () => {
        const datosConCaracteresEspeciales = plainToInstance(CrearUsuarioDto, {
            username: 'juan123',
            prim_nombre: 'juan123#@',
            apellido1: 'pérez',
            email: 'prueba@gmail.com',
            password_hash: 'clavesegura123',
        });

        const errores = await validate(datosConCaracteresEspeciales);
        expect(errores.length).toBeGreaterThan(0); //debe haber alemnos un error

        const errorNombre = errores.find(e => e.property === 'prim_nombre');
    })
});
