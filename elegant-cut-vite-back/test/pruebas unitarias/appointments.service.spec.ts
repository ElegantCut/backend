import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from '../../src/modules/appointments/appointments.service';
import { AppointmentsRepository } from '../../src/modules/appointments/appointments.repository';
import { USER_INTEGRATION_SERVICE } from '../../src/modules/users/interfaces/user-integration.interface';
import { BadRequestException } from '@nestjs/common';
import { CreateAppointmentDto } from '../../src/modules/appointments/dto/create-appointment.dto';

// Hacemos un mock del fetch para evitar que n8n se ejecute en las pruebas
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

describe('AppointmentsService - Pruebas Unitarias', () => {
  let service: AppointmentsService;
  let mockRepo: any;
  let mockUsersService: any;

  beforeEach(async () => {
    // Mocks de los repositorios y servicios externos
    mockRepo = {
      createAppointmentWithTransaction: jest.fn(),
      getAvailableSlots: jest.fn(),
      findAppointmentsByBarber: jest.fn(),
      findUniqueWithDetails: jest.fn(),
      updateAppointmentStatus: jest.fn(),
      updateAppointment: jest.fn(),
    };

    mockUsersService = {
      getUserBasicInfo: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: AppointmentsRepository, useValue: mockRepo },
        { provide: USER_INTEGRATION_SERVICE, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('El servicio de citas debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('Agendamiento de Citas (RF-006)', () => {
    it('Debe lanzar un error si se intenta agendar en una fecha pasada', async () => {
      // Configuramos una fecha pasada (ayer)
      const fechaAyer = new Date();
      fechaAyer.setDate(fechaAyer.getDate() - 1);
      
      const datosPasados: CreateAppointmentDto = {
        fecha: fechaAyer.toISOString(),
        id_usuario: 1,
        id_empleado: 2,
        id_servicio: 1,
        id_horarios: 10,
        observaciones: '',
        id_estado_cita: 1
      };

      // Debe arrojar BadRequestException configurada en el servicio
      await expect(service.createAppointment(datosPasados)).rejects.toThrow(BadRequestException);
      await expect(service.createAppointment(datosPasados)).rejects.toThrow('No puedes agendar citas en el pasado');
    });

    it('Debe rechazar la cita si el horario ya está ocupado simultáneamente (HORARIO_OCUPADO)', async () => {
      // Configuramos una fecha futura válida
      const fechaManana = new Date();
      fechaManana.setDate(fechaManana.getDate() + 1);

      const datos: CreateAppointmentDto = {
        fecha: fechaManana.toISOString(),
        id_usuario: 1,
        id_empleado: 2,
        id_servicio: 1,
        id_horarios: 10,
        observaciones: '',
        id_estado_cita: 1
      };

      // Simulamos que el repositorio arroja el error de horario ocupado
      mockRepo.createAppointmentWithTransaction.mockRejectedValue(new Error('HORARIO_OCUPADO'));

      // Debe transformar el error en un BadRequestException amigable
      await expect(service.createAppointment(datos)).rejects.toThrow(BadRequestException);
      await expect(service.createAppointment(datos)).rejects.toThrow('Este horario ya no está disponible para el barbero seleccionado');
    });

    it('Debe agendar correctamente en un bloque libre y notificar a n8n', async () => {
      const fechaManana = new Date();
      fechaManana.setDate(fechaManana.getDate() + 1);

      const datos: CreateAppointmentDto = {
        fecha: fechaManana.toISOString(),
        id_usuario: 1,
        id_empleado: 2,
        id_servicio: 1,
        id_horarios: 10,
        observaciones: '',
        id_estado_cita: 1
      };

      // Simulamos respuesta exitosa de la BD y de los usuarios para n8n
      mockRepo.createAppointmentWithTransaction.mockResolvedValue({ id_reservas: 50 });
      mockUsersService.getUserBasicInfo.mockResolvedValue({ email: 'test@test.com', prim_nombre: 'Test' });

      const resultado = await service.createAppointment(datos);

      expect(resultado).toHaveProperty('id_reservas', 50);
      expect(mockRepo.createAppointmentWithTransaction).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalled(); // Verifica que intentó llamar a n8n
    });
  });

  describe('Disponibilidad de Horarios (RF-007)', () => {
    it('Debe retornar la lista de slots disponibles consultando al repositorio', async () => {
      // Usamos una fecha que corresponda a un día laboral (2024-12-02 es Lunes)
      const slotsSimulados = ['09:00', '09:30', '10:30'];
      mockRepo.getAvailableSlots.mockResolvedValue(slotsSimulados);

      const resultado = await service.getAvailability('2024-12-02', 2, 30);

      expect(resultado).toEqual(slotsSimulados);
      expect(mockRepo.getAvailableSlots).toHaveBeenCalledWith('2024-12-02', 2, 30);
    });
  });

  describe('Listar Citas del Barbero (RF-030)', () => {
    it('Debe retornar las citas asignadas a un barbero', async () => {
      const citasSimuladas = [{ id_reservas: 1, id_empleado: 2 }];
      mockRepo.findAppointmentsByBarber.mockResolvedValue(citasSimuladas);

      const resultado = await service.getAppointmentsByBarber(2, '2026-08-20');

      expect(resultado).toEqual(citasSimuladas);
      expect(mockRepo.findAppointmentsByBarber).toHaveBeenCalledWith(2, '2026-08-20');
    });
  });

  describe('Completar Cita (RF-031)', () => {
    it('Debe cambiar el estado de la cita a Completada (2) si está Pendiente (1)', async () => {
      mockRepo.findUniqueWithDetails.mockResolvedValue({ id_reservas: 10, id_estado_cita: 1 });
      mockRepo.updateAppointmentStatus.mockResolvedValue({ id_reservas: 10, id_estado_cita: 2 });

      const resultado = await service.changeStatusAdmin(10, 2);

      expect(resultado.success).toBe(true);
      expect(mockRepo.updateAppointmentStatus).toHaveBeenCalledWith(10, 2);
    });

    it('Debe rechazar la actualización si la cita no está en estado Pendiente', async () => {
      mockRepo.findUniqueWithDetails.mockResolvedValue({ id_reservas: 10, id_estado_cita: 2 }); // Ya completada

      await expect(service.changeStatusAdmin(10, 3)).rejects.toThrow(BadRequestException);
    });
  });

  describe('Cancelar Cita (RF-032)', () => {
    it('Debe cancelar la cita cambiando su estado a 3 si pertenece al usuario', async () => {
      mockRepo.findUniqueWithDetails.mockResolvedValue({ id_reservas: 10, id_usuario: 5, id_estado_cita: 1 });
      mockRepo.updateAppointment.mockResolvedValue({ id_reservas: 10, id_estado_cita: 3 });

      const resultado = await service.cancelAppointment(10, 5);

      expect(mockRepo.updateAppointment).toHaveBeenCalledWith(10, { id_estado_cita: 3 });
    });

    it('Debe rechazar la cancelación si la cita pertenece a otro usuario', async () => {
      mockRepo.findUniqueWithDetails.mockResolvedValue({ id_reservas: 10, id_usuario: 5, id_estado_cita: 1 });

      await expect(service.cancelAppointment(10, 99)).rejects.toThrow('No puedes cancelar una cita que no te pertenece');
    });
  });

  describe('Reprogramar Cita (RF-033)', () => {
    it('Debe reprogramar la cita si la fecha es futura y el slot está disponible', async () => {
      const fechaFutura = new Date();
      fechaFutura.setDate(fechaFutura.getDate() + 5);

      mockRepo.findUniqueWithDetails.mockResolvedValue({
        id_reservas: 10,
        id_usuario: 5,
        id_empleado: 2,
        id_estado_cita: 1,
        fecha: new Date(),
        id_horarios: 1,
      });

      mockRepo.getAvailableSlots.mockResolvedValue([
        { id: 2, isAvailable: true }
      ]);
      mockRepo.updateAppointment.mockResolvedValue({ id_reservas: 10, id_horarios: 2 });

      const datosReprogramar = {
        userId: 5,
        fecha: fechaFutura.toISOString(),
        id_horarios: 2,
      };

      const resultado = await service.rescheduleAppointment(10, datosReprogramar);

      expect(mockRepo.updateAppointment).toHaveBeenCalled();
    });
  });
});

