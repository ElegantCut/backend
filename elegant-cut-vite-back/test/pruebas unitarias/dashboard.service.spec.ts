import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from '../../src/modules/dashboard/dashboard.service';
import { DashboardRepository } from '../../src/modules/dashboard/dashboard.repository';

describe('DashboardService - Pruebas Unitarias', () => {
  let service: DashboardService;
  let mockRepo: any;

  beforeEach(async () => {
    // Mocks del repositorio para aislar las pruebas de la base de datos
    mockRepo = {
      getSummaryStats: jest.fn(),
      getRecentActivity: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: DashboardRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('El servicio de dashboard debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('Generación de Estadísticas (RF-011)', () => {
    it('Debe devolver el resumen de estadísticas correctamente', async () => {
      const statsSimuladas = {
        data: {
          citasHoy: 5,
          ingresosHoy: 150000,
          clientesNuevos: 2,
          citasPendientes: 3,
          citasCompletadas: 2,
          citasCanceladas: 0,
        },
      };

      mockRepo.getSummaryStats.mockResolvedValue(statsSimuladas);

      const resultado = await service.getStats();

      expect(resultado).toEqual(statsSimuladas);
      expect(mockRepo.getSummaryStats).toHaveBeenCalledTimes(1);
    });

    it('Debe devolver la actividad reciente de citas', async () => {
      const actividadSimulada = [
        { id_reservas: 1, id_estado_cita: 1, fecha: new Date() },
        { id_reservas: 2, id_estado_cita: 2, fecha: new Date() },
      ];

      mockRepo.getRecentActivity.mockResolvedValue(actividadSimulada);

      const resultado = await service.getActivity();

      expect(resultado).toEqual(actividadSimulada);
      expect(mockRepo.getRecentActivity).toHaveBeenCalledTimes(1);
    });
  });

  describe('Generación de Reporte PDF (RF-011)', () => {
    it('Debe generar un buffer de PDF con las estadísticas y actividad actuales', async () => {
      // Configuramos respuestas simuladas
      mockRepo.getSummaryStats.mockResolvedValue({
        data: {
          citasHoy: 10,
          ingresosHoy: 500000,
          clientesNuevos: 4,
          citasPendientes: 5,
          citasCompletadas: 4,
          citasCanceladas: 1,
        },
      });

      mockRepo.getRecentActivity.mockResolvedValue([
        {
          id_reservas: 100,
          fecha: new Date(),
          id_estado_cita: 2,
          usuarios: { prim_nombre: 'Juan', apellido1: 'Perez' },
        },
      ]);

      // Ejecutamos la generación
      const pdfBuffer = await service.generateStatsPdf();

      // Validaciones
      expect(mockRepo.getSummaryStats).toHaveBeenCalled();
      expect(mockRepo.getRecentActivity).toHaveBeenCalled();
      
      // Debe retornar un Buffer de Node.js
      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      // El buffer generado no debe estar vacío
      expect(pdfBuffer.length).toBeGreaterThan(0);
    });

    it('Debe manejar arreglos vacíos o nulos sin fallar durante la generación del PDF', async () => {
      // Simulamos que la BD devuelve datos vacíos
      mockRepo.getSummaryStats.mockResolvedValue({ data: null });
      mockRepo.getRecentActivity.mockResolvedValue(null);

      const pdfBuffer = await service.generateStatsPdf();

      expect(Buffer.isBuffer(pdfBuffer)).toBe(true);
      expect(pdfBuffer.length).toBeGreaterThan(0);
    });
  });
});
