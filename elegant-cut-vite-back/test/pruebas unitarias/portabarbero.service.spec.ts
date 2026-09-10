import { Test, TestingModule } from '@nestjs/testing';
import { PortabarberoService } from '../../src/modules/portabarbero/portabarbero.service';
import { PortabarberoRepository } from '../../src/modules/portabarbero/portabarbero.repository';

describe('PortabarberoService - Pruebas Unitarias', () => {
  let service: PortabarberoService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findByUserId: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortabarberoService,
        {
          provide: PortabarberoRepository,
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<PortabarberoService>(PortabarberoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('RF-017: Portafolio de Barbero', () => {
    it('Debe consultar el portafolio por ID de usuario/barbero', async () => {
      const portafolio = { id_portafolio: 1, id_usuario: 2, biografia: 'Experto en degradados' };
      mockRepo.findByUserId.mockResolvedValue(portafolio);

      const resultado = await service.getPortafolioByBarber(2);

      expect(resultado).toEqual(portafolio);
      expect(mockRepo.findByUserId).toHaveBeenCalledWith(2);
    });

    it('Debe crear un portafolio serializando especialidades y fotos a JSON', async () => {
      mockRepo.findByUserId.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({ id_portafolio: 10 });

      const datos = {
        id_usuario: 2,
        biografia: 'Barbero Pro',
        especialidades: ['Corte', 'Barba'],
        fotos_portafolio: ['foto1.jpg'],
      };

      const resultado = await service.crearPortafolio(datos);

      expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        especialidades: JSON.stringify(['Corte', 'Barba']),
        fotos_portafolio: JSON.stringify(['foto1.jpg']),
      }));
    });

    it('Debe eliminar un portafolio si existe', async () => {
      mockRepo.findById.mockResolvedValue({ id_portafolio: 1 });
      mockRepo.delete.mockResolvedValue({ success: true });

      const resultado = await service.deletePortafolio(1);

      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});

