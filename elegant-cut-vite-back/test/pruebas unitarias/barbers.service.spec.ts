import { Test, TestingModule } from '@nestjs/testing';
import { BarbersService } from '../../src/modules/barbers/barbers.service';
import { BarbersRepository } from '../../src/modules/barbers/barbers.repository';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed_pass'),
}));

describe('BarbersService - Pruebas Unitarias', () => {
  let service: BarbersService;
  let mockRepo: any;

  beforeEach(async () => {
    mockRepo = {
      findAllWithPortfolioAndReviews: jest.fn(),
      findActive: jest.fn(),
      getStats: jest.fn(),
      createBarberWithPortfolio: jest.fn(),
      findOneWithDetails: jest.fn(),
      updateBarber: jest.fn(),
      findPortfolioByUserId: jest.fn(),
      updatePortfolio: jest.fn(),
      createPortfolio: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BarbersService,
        { provide: BarbersRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<BarbersService>(BarbersService);

    // bcryptjs ya está mockeado a nivel global en la cabecera
  });

  it('El servicio de Barberos debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('RF-023: Crear Barbero', () => {
    it('Debe crear un barbero, encriptar su clave y vincular su portafolio', async () => {
      const dto = {
        username: 'barber1',
        prim_nombre: 'Corte',
        email: 'barber@test.com',
        password_hash: '123',
        biografia: 'Experto en degradado',
      };

      mockRepo.createBarberWithPortfolio.mockResolvedValue({ 
        id_usuario: 5, 
        password_hash: 'hashed_pass',
        prim_nombre: 'Corte'
      });

      const resultado = await service.crearBarbero(dto as any);

      // Verificamos que se excluye la contraseña de la respuesta final
      expect(resultado).not.toHaveProperty('password_hash');
      expect(resultado).toHaveProperty('id_usuario', 5);

      expect(mockRepo.createBarberWithPortfolio).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'barber@test.com', password_hash: 'hashed_pass' }),
        expect.objectContaining({ biografia: 'Experto en degradado' }) // Portafolio
      );
    });
  });

  describe('RF-024: Listar Barberos', () => {
    it('Debe listar todos los barberos registrados', async () => {
      mockRepo.findAllWithPortfolioAndReviews.mockResolvedValue([
        { id_usuario: 2, prim_nombre: 'B1', portafolios: [] },
        { id_usuario: 3, prim_nombre: 'B2', portafolios: [] }
      ]);

      const resultado = await service.obtenerBarberos();

      expect(resultado).toHaveLength(2);
      expect(resultado[0]).toHaveProperty('calificacion_promedio'); // Verifica el maping interno
      expect(mockRepo.findAllWithPortfolioAndReviews).toHaveBeenCalledWith(false);
    });
  });

  describe('RF-025: Activar/Desactivar Barbero', () => {
    it('Debe alternar (toggle) el estado de un barbero', async () => {
      // Configuramos el mock para findOne (es llamado internamente por toggleStatus)
      mockRepo.findOneWithDetails.mockResolvedValue({ id_usuario: 2, estado: true, portafolios: [] });
      mockRepo.updateBarber.mockResolvedValue({ success: true });

      const resultado = await service.toggleStatus(2);

      // Si el estado original era true, debe intentar ponerlo en false
      expect(resultado.success).toBe(true);
      expect(resultado.newStatus).toBe(false);
      expect(mockRepo.updateBarber).toHaveBeenCalledWith(2, { estado: false });
    });

    it('Debe ocultar al barbero (desactivarlo suavemente) con el método remove', async () => {
      mockRepo.findOneWithDetails.mockResolvedValue({ id_usuario: 2, estado: true, portafolios: [] });
      mockRepo.updateBarber.mockResolvedValue({ id_usuario: 2, estado: false });

      const resultado = await service.remove(2);

      expect(resultado.estado).toBe(false);
      expect(mockRepo.updateBarber).toHaveBeenCalledWith(2, { estado: false });
    });
  });

  describe('mapBarberWithRating coverage', () => {
    it('Debe calcular la calificacion promedio correctamente', async () => {
      mockRepo.findOneWithDetails.mockResolvedValue({
        id_usuario: 1,
        username: 'test',
        estado: true,
        password_hash: '123',
        resenas_recibidas: [{ calificacion: 4 }, { calificacion: 5 }],
        portafolios: { calificacion: 0, rese_as_count: 0, fotos_portafolio: [] }
      });

      const result = await service.findOne(1);
      expect(result.calificacion_promedio).toBe(4.5);
    });
  });
});

