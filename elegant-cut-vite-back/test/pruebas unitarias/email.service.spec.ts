import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../../src/modules/email/email.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('EmailService - Pruebas Unitarias', () => {
  let service: EmailService;
  let mockPrisma: any;
  let mockConfig: any;

  beforeEach(async () => {
    mockPrisma = {
      cola_correos: {
        create: jest.fn().mockResolvedValue({ id_cola: 1 }),
        findMany: jest.fn().mockResolvedValue([]),
        update: jest.fn().mockResolvedValue({}),
      },
    };

    mockConfig = {
      get: jest.fn().mockReturnValue('test@test.com'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('El servicio de Email debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('RF-015: Notificaciones por Email', () => {
    it('Debe encolar correctamente un correo de verificación', async () => {
      const result = await service.sendVerificationCode('usuario@test.com', '123456');

      expect(result).toBe(true);
      expect(mockPrisma.cola_correos.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          destinatario: 'usuario@test.com',
          asunto: 'Código de Verificación - Elegant Cut',
          estado: 'Pendiente',
        }),
      });
    });

    it('Debe encolar correctamente un correo de confirmación de PQRS', async () => {
      const result = await service.sendPqrsConfirmation(
        'usuario@test.com',
        'Juan Perez',
        'PQRS-100-2026',
        'queja',
      );

      expect(result).toBe(true);
      expect(mockPrisma.cola_correos.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          destinatario: 'usuario@test.com',
          asunto: 'Confirmación de PQRS - PQRS-100-2026',
          estado: 'Pendiente',
        }),
      });
    });
  });
});
