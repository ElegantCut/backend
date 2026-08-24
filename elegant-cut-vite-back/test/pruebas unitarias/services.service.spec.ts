import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from '../../src/modules/services/services.service';
import { ServicesRepository } from '../../src/modules/services/services.repository';
import { NotFoundException } from '@nestjs/common';
import { CrearServicioDto } from '../../src/modules/services/dto/create-servicio.dto';

describe('ServicesService - Pruebas Unitarias', () => {
  let service: ServicesService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      findAll: jest.fn(),
      findAllAdmin: jest.fn(),
      findByGender: jest.fn(),
      crearServicio: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        { provide: ServicesRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
  });

  it('El servicio de Servicios debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('RF-026: Crear Servicio', () => {
    it('Debe crear un nuevo servicio exitosamente', async () => {
      const dto: CrearServicioDto = {
        nombre: 'Corte Clásico',
        descripcion: 'Corte tradicional a tijera',
        precio: 25000,
        duracion: 30,
        id_categoria: 1,
      };

      mockRepo.crearServicio.mockResolvedValue({ id_servicio: 10, ...dto });

      const resultado = await service.crearServicio(dto);

      expect(resultado).toHaveProperty('id_servicio', 10);
      expect(mockRepo.crearServicio).toHaveBeenCalledWith(dto);
    });
  });

  describe('RF-027: Listar Servicios', () => {
    it('Debe listar todos los servicios para los clientes y agregar imagen_url', async () => {
      mockRepo.findAll.mockResolvedValue([
        { id_servicio: 1, nombre: 'Corte', imagen: 'corte.jpg' }
      ]);

      const resultado = await service.findAll();

      expect(resultado).toHaveLength(1);
      expect(resultado[0]).toHaveProperty('imagen_url');
      expect(mockRepo.findAll).toHaveBeenCalled();
    });

    it('Debe listar los servicios filtrados por género', async () => {
      mockRepo.findByGender.mockResolvedValue([
        { id_servicio: 2, nombre: 'Arreglo de Barba' }
      ]);

      const resultado = await service.findByGender(1); // 1 = Masculino

      expect(resultado).toHaveLength(1);
      expect(mockRepo.findByGender).toHaveBeenCalledWith(1);
    });

    it('Debe listar los servicios con formato para Admin', async () => {
      mockRepo.findAllAdmin.mockResolvedValue([
        { id_servicio: 3, nombre: 'Perfilado', descripcion: '...', precio: 15000, duracion: 15, imagen: 'perfilado.jpg' }
      ]);

      const resultado = await service.findAllAdmin();

      expect(resultado.success).toBe(true);
      expect(resultado.data[0]).toHaveProperty('nombre_servicio', 'Perfilado'); // Verifica el mapeo
      expect(resultado.data[0]).toHaveProperty('duracion_minutos', 15);
    });
  });

  describe('RF-028: Editar Servicio', () => {
    it('Debe editar los datos de un servicio existente', async () => {
      mockRepo.findById.mockResolvedValue({ id_servicio: 1 }); // Verifica que existe
      mockRepo.update.mockResolvedValue({ id_servicio: 1, precio: 30000 });

      const resultado = await service.update(1, { precio: 30000 });

      expect(resultado.precio).toBe(30000);
      expect(mockRepo.update).toHaveBeenCalledWith(1, { precio: 30000 });
    });

    it('Debe arrojar NotFoundException si el servicio a editar no existe', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.update(99, { precio: 100 })).rejects.toThrow(NotFoundException);
    });
  });

  describe('RF-029: Eliminar Servicio', () => {
    it('Debe eliminar un servicio exitosamente', async () => {
      mockRepo.findById.mockResolvedValue({ id_servicio: 1 });
      mockRepo.remove.mockResolvedValue({ success: true });

      const resultado = await service.remove(1);

      expect(resultado.success).toBe(true);
      expect(mockRepo.remove).toHaveBeenCalledWith(1);
    });

    it('Debe atrapar el error y retornar success: false si hay conflicto de llaves foráneas', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockRepo.findById.mockResolvedValue({ id_servicio: 1 });
      mockRepo.remove.mockRejectedValue(new Error('Foreign key constraint')); // Simula error de BD

      const resultado = await service.remove(1);

      expect(resultado.success).toBe(false);
      expect(resultado.message).toContain('dependencias');
      consoleSpy.mockRestore();
    });
  });
});
