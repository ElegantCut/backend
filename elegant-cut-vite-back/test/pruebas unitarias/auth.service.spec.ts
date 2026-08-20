import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../../src/modules/email/email.service';
import { AuthRepository } from '../../src/modules/auth/auth.repository';
import { USER_INTEGRATION_SERVICE } from '../../src/modules/users/interfaces/user-integration.interface';
import { UnauthorizedException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CrearUsuarioDto } from '../../src/modules/users/dto/create-users.dto';

describe('AuthService - Pruebas Unitarias Iniciales', () => {
    let service: AuthService;
    let mockUsersService: any;
    let mockJwtService: any;
    let mockEmailService: any;
    let mockAuthRepo: any;

    beforeEach(async () => {
        mockUsersService = {
            findOneByUsername: jest.fn(),
            comparePassword: jest.fn(),
        };

        mockJwtService = { sign: jest.fn().mockReturnValue('token-falso-123') };
        mockEmailService = { sendVerificationCode: jest.fn() };
        mockAuthRepo = { findValidVerificationCode: jest.fn() };

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


    it('Debe rechazar el registro si el nombre contiene caracteres especiales y números (112, @, $, #)', async () => {
        const datosConCaracteresEspeciales = plainToInstance(CrearUsuarioDto, {
            username: 'juan123',
            prim_nombre: 'juan123#@',
            apellido1: 'pérez',
            email: 'prueba@gmail.com',
            password_hash: 'clavesegura123',
        });

        const errores = await validate(datosConCaracteresEspeciales);
        expect(errores.length).toBeGreaterThan(0); // debe haber al menos un error
        
        const errorNombre = errores.find(e => e.property === 'prim_nombre');
        expect(errorNombre).toBeDefined();
    });

    it('Debe arrojar error al solicitar recuperación si email no está registrado', async () => {
        mockUsersService.findByEmail = jest.fn().mockResolvedValue(null);

        await expect(service.solicitarRecuperacion('noexiste@gmail.com')).rejects.toThrow('Email no registrado');
    });

    it('Debe enviar código de recuperación correctamente', async () => {
        mockUsersService.findByEmail = jest.fn().mockResolvedValue({
            id_usuario: 1, email: 'prueba@gmail.com'
        });
        mockAuthRepo.createVerificationCode = jest.fn().mockResolvedValue(true);

        const result = await service.solicitarRecuperacion('prueba@gmail.com');
        
        expect(result.message).toBe('Se ha enviado un código a tu correo.');
        expect(mockAuthRepo.createVerificationCode).toHaveBeenCalled();
        expect(mockEmailService.sendVerificationCode).toHaveBeenCalled();
    });

    it('Debe manejar excepción de findByEmail en solicitarRecuperacion', async () => {
        mockUsersService.findByEmail = jest.fn().mockRejectedValue(new Error('No encontrado'));
        await expect(service.solicitarRecuperacion('prueba@gmail.com')).rejects.toThrow('Email no registrado');
    });

    it('Debe resetear la contraseña correctamente', async () => {
        mockAuthRepo.findValidVerificationCode = jest.fn().mockResolvedValue({ id: 1 });
        mockUsersService.findByEmail = jest.fn().mockResolvedValue({ id_usuario: 1, email: 'prueba@gmail.com' });
        mockUsersService.updatePasswordByEmail = jest.fn().mockResolvedValue(true);
        mockAuthRepo.markCodeAsUsed = jest.fn().mockResolvedValue(true);

        const result = await service.resetPassword({ email: 'prueba@gmail.com', codigo: '123456', newPassword: 'new123' });

        expect(result.success).toBe(true);
        expect(result.message).toBe('Contraseña actualizada correctamente');
        expect(mockUsersService.updatePasswordByEmail).toHaveBeenCalled();
    });

    it('Debe iniciar sesión con Google exitosamente', async () => {
        service['googleClient'].verifyIdToken = jest.fn().mockResolvedValue({
            getPayload: () => ({ email: 'google@gmail.com', sub: '12345' })
        });
        mockUsersService.findByEmailOrGoogleId = jest.fn().mockResolvedValue({
            id_usuario: 1, email: 'google@gmail.com', username: 'google123', google_id: '12345'
        });

        const result = await service.googleLogin('token');
        expect(result.success).toBe(true);
        expect(result.token).toBe('token-falso-123');
    });

    it('Debe fallar si payload de Google es nulo', async () => {
        service['googleClient'].verifyIdToken = jest.fn().mockResolvedValue({
            getPayload: () => null
        });
        await expect(service.googleLogin('token')).rejects.toThrow('Error al validar con Google');
    });

    it('Debe crear usuario al iniciar sesión con Google si no existe', async () => {
        service['googleClient'].verifyIdToken = jest.fn().mockResolvedValue({
            getPayload: () => ({ email: 'nuevo@gmail.com', sub: '12345', given_name: null, family_name: null })
        });
        mockUsersService.findByEmailOrGoogleId = jest.fn().mockResolvedValue(null);
        mockUsersService.crearUsuarioConGoogle = jest.fn().mockResolvedValue({
            id_usuario: 2, email: 'nuevo@gmail.com', username: 'nuevo123', id_rol: 2
        });

        const result = await service.googleLogin('token');
        expect(result.success).toBe(true);
        expect(mockUsersService.crearUsuarioConGoogle).toHaveBeenCalled();
    });

    it('Debe crear usuario al iniciar sesión con Google con nombres proporcionados', async () => {
        service['googleClient'].verifyIdToken = jest.fn().mockResolvedValue({
            getPayload: () => ({ email: 'nombres@gmail.com', sub: '12345', given_name: 'Juan', family_name: 'Perez' })
        });
        mockUsersService.findByEmailOrGoogleId = jest.fn().mockResolvedValue(null);
        mockUsersService.crearUsuarioConGoogle = jest.fn().mockResolvedValue({
            id_usuario: 3, email: 'nombres@gmail.com', username: 'juanp123', id_rol: 2
        });

        const result = await service.googleLogin('token2');
        expect(result.success).toBe(true);
        expect(mockUsersService.crearUsuarioConGoogle).toHaveBeenCalled();
    });

    it('Debe crear usuario al iniciar sesión con Google si no existe y no hay email', async () => {
        service['googleClient'].verifyIdToken = jest.fn().mockResolvedValue({
            getPayload: () => ({ email: '', sub: '12345', given_name: null, family_name: null })
        });
        mockUsersService.findByEmailOrGoogleId = jest.fn().mockResolvedValue(null);
        mockUsersService.crearUsuarioConGoogle = jest.fn().mockResolvedValue({
            id_usuario: 2, email: '', username: 'user123', id_rol: 2
        });

        const result = await service.googleLogin('token');
        expect(result.success).toBe(true);
        expect(mockUsersService.crearUsuarioConGoogle).toHaveBeenCalled();
    });

    it('Debe vincular cuenta si google_id falta al iniciar sesión con Google', async () => {
        service['googleClient'].verifyIdToken = jest.fn().mockResolvedValue({
            getPayload: () => ({ email: 'existe@gmail.com', sub: '12345' })
        });
        mockUsersService.findByEmailOrGoogleId = jest.fn().mockResolvedValue({
            id_usuario: 3, email: 'existe@gmail.com', username: 'existe123' // sin google_id
        });
        mockUsersService.vincularGoogleId = jest.fn().mockResolvedValue({
            id_usuario: 3, email: 'existe@gmail.com', username: 'existe123', google_id: '12345'
        });

        const result = await service.googleLogin('token');
        expect(result.success).toBe(true);
        expect(mockUsersService.vincularGoogleId).toHaveBeenCalled();
    });

    it('Debe iniciar sesión con Google Server Side exitosamente', async () => {
        mockUsersService.findByEmailOrGoogleId = jest.fn().mockResolvedValue({
            id_usuario: 1, email: 'server@gmail.com', username: 'server123'
        });

        const result = await service.googleLoginServerSide({ email: 'server@gmail.com' });
        expect(result.success).toBe(true);
        expect(result.token).toBe('token-falso-123');
    });

    it('Debe lanzar error si reqUser es nulo en googleLoginServerSide', async () => {
        await expect(service.googleLoginServerSide(null)).rejects.toThrow('Error al registrar/logear con Google');
    });

    it('Debe crear usuario al iniciar sesión con Google Server Side si no existe', async () => {
        mockUsersService.findByEmailOrGoogleId = jest.fn().mockResolvedValue(null);
        mockUsersService.crearUsuarioConGoogle = jest.fn().mockResolvedValue({
            id_usuario: 2, email: 'server@gmail.com', username: 'server123', id_rol: 2
        });

        const result = await service.googleLoginServerSide({ email: 'server@gmail.com', firstName: null, lastName: null });
        expect(result.success).toBe(true);
        expect(mockUsersService.crearUsuarioConGoogle).toHaveBeenCalled();
    });

    it('Debe crear usuario al iniciar sesión con Google Server Side con nombres', async () => {
        mockUsersService.findByEmailOrGoogleId = jest.fn().mockResolvedValue(null);
        mockUsersService.crearUsuarioConGoogle = jest.fn().mockResolvedValue({
            id_usuario: 4, email: 'server3@gmail.com', username: 'server123', id_rol: 2
        });

        const result = await service.googleLoginServerSide({ email: 'server3@gmail.com', firstName: 'Juan', lastName: 'Perez' });
        expect(result.success).toBe(true);
        expect(mockUsersService.crearUsuarioConGoogle).toHaveBeenCalled();
    });

    it('Debe crear usuario al iniciar sesión con Google Server Side si no existe y falta email', async () => {
        mockUsersService.findByEmailOrGoogleId = jest.fn().mockResolvedValue(null);
        mockUsersService.crearUsuarioConGoogle = jest.fn().mockResolvedValue({
            id_usuario: 2, email: '', username: 'user123', id_rol: 2
        });

        const result = await service.googleLoginServerSide({ email: '', firstName: null, lastName: null });
        expect(result.success).toBe(true);
        expect(mockUsersService.crearUsuarioConGoogle).toHaveBeenCalled();
    });

    it('Debe iniciar sesión con Google Server Side exitosamente cuando ya tiene google_id', async () => {
        mockUsersService.findByEmailOrGoogleId = jest.fn().mockResolvedValue({
            id_usuario: 1, email: 'server2@gmail.com', username: 'server123', google_id: 'existente'
        });

        const result = await service.googleLoginServerSide({ email: 'server2@gmail.com' });
        expect(result.success).toBe(true);
        expect(result.token).toBe('token-falso-123');
    });

    it('Debe lanzar UnauthorizedException si googleClient falla', async () => {
        service['googleClient'].verifyIdToken = jest.fn().mockRejectedValue(new Error('Fallo simulado'));
        await expect(service.googleLogin('token')).rejects.toThrow('Error al validar con Google');
    });
});
