import { Test, TestingModule } from '@nestjs/testing';
import { PqrsService } from '../../src/modules/pqrs/pqrs.service';
import { PqrsRepository } from '../../src/modules/pqrs/pqrs.repository';
import { EmailService } from '../../src/modules/email/email.service';
import { NotFoundException } from '@nestjs/common';
import { CrearPqrsDto, PqrsTipoSolicitud } from '../../src/modules/pqrs/dto/create-pqrs.dto';

describe('PqrsService - Pruebas Unitarias', () => {
  let service: PqrsService;
  let mockRepo: any;
  let mockEmailService: any;

  beforeEach(async () => {
    // Mocks de repositorio y servicio de emails
    mockRepo = {
      create: jest.fn(),
      findByUserData: jest.fn(),
      obtenerPqrs: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      findByRadicado: jest.fn(),
    };

    mockEmailService = {
      sendPqrsConfirmation: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PqrsService,
        { provide: PqrsRepository, useValue: mockRepo },
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    service = module.get<PqrsService>(PqrsService);
  });

  it('El servicio de PQRS debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('Creación de PQRS (RF-009)', () => {
    it('Debe crear una PQRS, generar un radicado y enviar correo de confirmación', async () => {
      const dto: CrearPqrsDto = {
        id_usuario: 1,
        nombre_completo: 'Usuario Prueba',
        email: 'prueba@test.com',
        telefono: '3001234567',
        tipo_solicitud: PqrsTipoSolicitud.queja,
        asunto: 'Servicio',
        descripcion: 'El barbero llegó tarde',
      };

      // Simulamos que la BD guarda la PQRS y retorna el ID 100
      mockRepo.create.mockResolvedValue(100);

      const resultado = await service.create(dto);

      const year = new Date().getFullYear();
      const radicadoEsperado = `PQRS-100-${year}`;

      // Verificamos respuestas
      expect(resultado.success).toBe(true);
      expect(resultado.radicado).toBe(radicadoEsperado);

      // Verificamos integración de correo
      expect(mockEmailService.sendPqrsConfirmation).toHaveBeenCalledWith(
        'prueba@test.com',
        'Usuario Prueba',
        radicadoEsperado,
        PqrsTipoSolicitud.queja
      );
    });
  });

  describe('Consulta de PQRS (RF-016)', () => {
    it('Debe buscar PQRS por correo electrónico del usuario', async () => {
      mockRepo.findByUserData.mockResolvedValue([{ id_pqrs: 1 }]);
      
      const resultado = await service.searchByUser('prueba@test.com');
      
      expect(resultado).toHaveLength(1);
      expect(mockRepo.findByUserData).toHaveBeenCalledWith('prueba@test.com');
    });

    it('Debe extraer el ID del radicado y buscarlo correctamente', async () => {
      mockRepo.findByRadicado.mockResolvedValue({ id_pqrs: 25, estado: 'Abierto' });

      const resultado = await service.findByRadicado('PQRS-25-2026');

      expect(resultado.success).toBe(true);
      expect(resultado.data).toHaveProperty('estado', 'Abierto');
      expect(mockRepo.findByRadicado).toHaveBeenCalledWith(25);
    });

    it('Debe arrojar error si el radicado tiene formato inválido', async () => {
      await expect(service.findByRadicado('INVALIDO-25')).rejects.toThrow(NotFoundException);
      await expect(service.findByRadicado('PQRS-ABC-2026')).rejects.toThrow(NotFoundException);
    });
  });

  describe('Administración de PQRS', () => {
    it('Debe retornar NotFoundException si la PQRS no existe', async () => {
      mockRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('Debe actualizar el estado de una PQRS existente', async () => {
      // Mock para findOne simulando que sí existe (requerido por service.update)
      mockRepo.findOne.mockResolvedValue({ id_pqrs: 10 });
      mockRepo.update.mockResolvedValue({ id_pqrs: 10, estado: 'Cerrado' });

      const resultado = await service.update(10, { estado: 'Cerrado' });

      expect(resultado.estado).toBe('Cerrado');
      expect(resultado.id_pqrs).toBe(10);
      expect(mockRepo.update).toHaveBeenCalledWith(10, { estado: 'Cerrado' });
    });
  });
});
