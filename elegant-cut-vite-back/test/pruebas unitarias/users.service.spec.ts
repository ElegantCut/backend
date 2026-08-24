import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/modules/users/users.service';
import { UsersRepository } from '../../src/modules/users/users.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('UsersService - Pruebas Unitarias', () => {
  let service: UsersService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      createFullUser: jest.fn(),
      findByRole: jest.fn(),
      findById: jest.fn(),
      updateUser: jest.fn(),
      updateStatus: jest.fn(),
      remove: jest.fn(),
      getUserBasicInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsersRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    // Mocking hash method directly to avoid real crypto overhead
    jest.spyOn(service, 'hashPassword').mockResolvedValue('hashed_password_123');
  });

  it('El servicio de Usuarios debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('RF-014: Perfil de Usuario', () => {
    it('Debe consultar la información básica del perfil del usuario (getUserBasicInfo)', async () => {
      const usuarioSimulado = { id_usuario: 5, prim_nombre: 'Juan', apellido1: 'Perez', email: 'juan@test.com' };
      mockRepo.getUserBasicInfo.mockResolvedValue(usuarioSimulado);

      const resultado = await service.getUserBasicInfo(5);

      expect(resultado).toEqual(usuarioSimulado);
      expect(mockRepo.getUserBasicInfo).toHaveBeenCalledWith(5);
    });

    it('Debe actualizar los datos de perfil del cliente', async () => {
      mockRepo.findById.mockResolvedValue({ id_usuario: 5, prim_nombre: 'Juan' });
      mockRepo.updateUser.mockResolvedValue({ id_usuario: 5, prim_nombre: 'Juan Carlos', telefono: '3009998877' });

      const resultado = await service.update(5, { prim_nombre: 'Juan Carlos', telefono: '3009998877' } as any);

      expect(resultado.prim_nombre).toBe('Juan Carlos');
      expect(mockRepo.updateUser).toHaveBeenCalledWith(5, expect.objectContaining({ prim_nombre: 'Juan Carlos' }));
    });
  });

  describe('RF-019: Crear Administrador', () => {
    it('Debe crear un usuario con id_rol = 1 (Admin) exitosamente', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.findByUsername.mockResolvedValue(null);
      
      const adminDto = {
        username: 'adminTest',
        prim_nombre: 'Admin',
        email: 'admin@test.com',
        password_hash: '12345',
        id_rol: 1, // Rol Administrador forzado desde el request
      };

      mockRepo.createFullUser.mockResolvedValue({ id_usuario: 1, ...adminDto, password_hash: 'hashed_password_123' });

      const resultado = await service.crearUsuario(adminDto as any);

      expect(resultado).toHaveProperty('id_rol', 1);
      expect(mockRepo.createFullUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id_rol: 1,
          password_hash: 'hashed_password_123',
        })
      );
    });

    it('Debe rechazar la creación si el email ya existe', async () => {
      mockRepo.findByEmail.mockResolvedValue({ id_usuario: 1 }); // Email ocupado
      
      await expect(service.crearUsuario({ email: 'admin@test.com' } as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('RF-020: Listar Administradores', () => {
    it('Debe listar todos los usuarios con rol 1', async () => {
      mockRepo.findByRole.mockResolvedValue([{ id_usuario: 1, id_rol: 1 }, { id_usuario: 2, id_rol: 1 }]);

      const resultado = await service.findAllAdmins();

      expect(resultado.success).toBe(true);
      expect(resultado.data).toHaveLength(2);
      expect(mockRepo.findByRole).toHaveBeenCalledWith(1);
    });

    it('Debe retornar un array vacío si ocurre un error', async () => {
      mockRepo.findByRole.mockRejectedValue(new Error('DB Error'));

      const resultado = await service.findAllAdmins();

      expect(resultado.success).toBe(false);
      expect(resultado.data).toEqual([]);
    });
  });

  describe('RF-021: Editar Administrador', () => {
    it('Debe actualizar los datos de un administrador', async () => {
      mockRepo.findById.mockResolvedValue({ id_usuario: 1 }); // Existe
      mockRepo.updateUser.mockResolvedValue({ id_usuario: 1, prim_nombre: 'Nuevo Nombre' });

      const resultado = await service.update(1, { prim_nombre: 'Nuevo Nombre' });

      expect(resultado.prim_nombre).toBe('Nuevo Nombre');
      expect(mockRepo.updateUser).toHaveBeenCalledWith(1, { prim_nombre: 'Nuevo Nombre' });
    });

    it('Debe encriptar la contraseña si se envía en la edición', async () => {
      mockRepo.findById.mockResolvedValue({ id_usuario: 1 }); 
      mockRepo.updateUser.mockResolvedValue({ id_usuario: 1 });

      await service.update(1, { password_hash: 'nuevopass' });

      expect(service.hashPassword).toHaveBeenCalledWith('nuevopass');
      expect(mockRepo.updateUser).toHaveBeenCalledWith(1, expect.objectContaining({ password_hash: 'hashed_password_123' }));
    });
  });

  describe('RF-022: Activar/Desactivar Administrador', () => {
    it('Debe desactivar (borrado suave) un administrador cambiando su estado a false', async () => {
      mockRepo.findById.mockResolvedValue({ id_usuario: 1 });
      mockRepo.updateStatus.mockResolvedValue({ id_usuario: 1, estado: false });

      // remove() en users.service llama a updateStatus(id, false)
      const resultado = await service.remove(1);

      expect(resultado.estado).toBe(false);
      expect(mockRepo.updateStatus).toHaveBeenCalledWith(1, false);
    });
  });
});

