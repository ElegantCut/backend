import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../src/modules/email/email.service';
import { AuthRepository } from '../../src/modules/auth/auth.repository';
import { USER_INTEGRATION_SERVICE } from '../../src/modules/users/interfaces/user-integration.interface';
import { BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CrearUsuarioDto } from '../../src/modules/users/dto/create-users.dto';
import * as bcrypt from 'bcryptjs';

// Hacemos mock de bcrypt para evitar cálculos costosos durante los tests
jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('random_salt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('AuthService - Pruebas Unitarias', () => {
    let service: AuthService;
    let mockUsersService: any;
    let mockAuthRepo: any;
    let mockEmailService: any;

    beforeEach(async () => {
        mockUsersService = {
            findOneByUsername: jest.fn(),
            comparePassword: jest.fn(),
            crearUsuario: jest.fn(),
            findByEmail: jest.fn(),
            updatePasswordByEmail: jest.fn(),
        };

        const mockJwtService = { sign: jest.fn().mockReturnValue('token-falso-123') };
        
        mockEmailService = { 
            sendVerificationCode: jest.fn() 
        };
        
        mockAuthRepo = { 
            findValidVerificationCode: jest.fn(),
            createVerificationCode: jest.fn(),
            markCodeAsUsed: jest.fn(),
        };

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

    it('El servicio de autenticación debe estar definido', () => {
        expect(service).toBeDefined();
    });

    describe('Login de Usuario', () => {
        it('Debe arrojar un error de "Contraseña incorrecta" si la contraseña no coincide', async () => {
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

        it('Debe iniciar sesión exitosamente y devolver un token si los credenciales son correctas', async () => {
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
            expect(resultado.token).toBe('token-falso-123');
        });
    });

    describe('Registro de Usuario (RF-001)', () => {
        it('Debe registrar al usuario y devolver sus datos sin la contraseña', async () => {
            const dto = new CrearUsuarioDto();
            dto.username = 'nuevo_usuario';
            dto.email = 'nuevo@correo.com';

            mockUsersService.crearUsuario.mockResolvedValue({
                id_usuario: 10,
                username: 'nuevo_usuario',
                email: 'nuevo@correo.com',
                prim_nombre: 'Nuevo',
                apellido1: 'User',
                id_rol: 2,
            });

            const resultado = await service.register(dto);

            expect(resultado.success).toBe(true);
            expect(resultado.user.email).toBe('nuevo@correo.com');
            expect(resultado.user).not.toHaveProperty('password');
            expect(mockUsersService.crearUsuario).toHaveBeenCalled();
        });
    });

    describe('Recuperación de Contraseña (RF-002)', () => {
        it('Debe enviar código de recuperación si el correo existe', async () => {
            mockUsersService.findByEmail.mockResolvedValue({ id: 1, email: 'test@correo.com' });
            
            await service.solicitarRecuperacion('test@correo.com');

            expect(mockAuthRepo.createVerificationCode).toHaveBeenCalled();
            expect(mockEmailService.sendVerificationCode).toHaveBeenCalled();
        });

        it('Debe rechazar la solicitud si el correo no existe', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);

            await expect(service.solicitarRecuperacion('noexiste@correo.com')).rejects.toThrow(BadRequestException);
            await expect(service.solicitarRecuperacion('noexiste@correo.com')).rejects.toThrow('Email no registrado');
        });

        it('Debe actualizar la contraseña si el código es válido', async () => {
            mockAuthRepo.findValidVerificationCode.mockResolvedValue({ id: 100, email: 'test@correo.com' });
            mockUsersService.findByEmail.mockResolvedValue({ id: 1, email: 'test@correo.com' });

            const resultado = await service.resetPassword({
                email: 'test@correo.com',
                codigo: '123456',
                newPassword: 'nuevaPassword123!'
            });

            expect(resultado.success).toBe(true);
            expect(bcrypt.hash).toHaveBeenCalledWith('nuevaPassword123!', 'random_salt');
            expect(mockUsersService.updatePasswordByEmail).toHaveBeenCalledWith('test@correo.com', 'hashed_password');
            expect(mockAuthRepo.markCodeAsUsed).toHaveBeenCalledWith(100);
        });

        it('Debe rechazar el cambio de contraseña si el código expiró o no existe', async () => {
            mockAuthRepo.findValidVerificationCode.mockResolvedValue(null);

            await expect(service.resetPassword({
                email: 'test@correo.com',
                codigo: '111111',
                newPassword: 'nuevaPassword123!'
            })).rejects.toThrow(BadRequestException);
        });
    });

    describe('Validaciones de DTO', () => {
        it('Debe rechazar el registro si el nombre contiene caracteres especiales o números', async () => {
            const datosConCaracteresEspeciales = plainToInstance(CrearUsuarioDto, {
                username: 'juan123',
                prim_nombre: 'juan123#@',
                apellido1: 'pérez',
                email: 'prueba@gmail.com',
                password_hash: 'clavesegura123',
            });

            const errores = await validate(datosConCaracteresEspeciales);
            
            expect(errores.length).toBeGreaterThan(0);
            
            const errorNombre = errores.find(e => e.property === 'prim_nombre');
            expect(errorNombre).toBeDefined();
        });
    });
});
