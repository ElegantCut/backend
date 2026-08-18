import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Inject } from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { USER_INTEGRATION_SERVICE } from '../users/interfaces/user-integration.interface';
import type { IUserIntegration } from '../users/interfaces/user-integration.interface';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepo: AppointmentsRepository,
    @Inject(USER_INTEGRATION_SERVICE) private readonly usersService: IUserIntegration,
  ) {}

  async getAvailability(date: string, barberId: number, serviceDuration?: number) {
    return this.appointmentsRepo.getAvailableSlots(date, barberId, serviceDuration);
  }

  async bookAppointment(data: any) {
    return this.appointmentsRepo.create(data);
  }

  async getAll() {
    return this.appointmentsRepo.findAll();
  }

  async getHorarios() {
    return this.appointmentsRepo.findAllHorarios();
  }

  // Nuevo método formateado específicamente para el listado del panel de Administrador
  async findAllAdmin() {
    try {
      const citas = await this.appointmentsRepo.findAllWithDetails();

      const data = citas.map((cita) => {
        // Determinar estado textual sugerido (1=Pendiente, 2=Completada, 3=Cancelada)
        let estadoText = 'Pendiente';
        if (cita.id_estado_cita === 2) estadoText = 'Completada';
        if (cita.id_estado_cita === 3) estadoText = 'Cancelada';

        // Extraer el nombre del servicio principal
        const srv = cita.detalle_cita_servicio?.[0]?.servicios;
        const nombreServicio = srv ? srv.nombre : 'Servicio general';

        // Formatear hora inicio (ej. 900 -> "9:00 AM")
        let horaStr = cita.horarios?.hora_inicio?.toString() || '000';
        if (horaStr.length === 3) horaStr = '0' + horaStr; // 900 -> 0900
        const hh = horaStr.slice(0, 2);
        const mm = horaStr.slice(2, 4);
        const horaFormat = `${hh}:${mm}`;

        return {
          id_reservas: cita.id_reservas,
          fecha: cita.fecha,
          hora_inicio: horaFormat,
          cliente: cita.usuarios
            ? `${cita.usuarios.prim_nombre} ${cita.usuarios.apellido1}`
            : 'Desconocido',
          servicio: nombreServicio,
          estado: estadoText,
        };
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching admin appointments:', error);
      return { success: false, data: [] };
    }
  }

  // Nuevo método formateado específicamente para el listado del panel de Administrador
  async changeStatusAdmin(id: number, nuevoEstado: number) {
    try {
      console.log(`[Admin] Actualizando cita ${id} a estado ${nuevoEstado}`);

      const updated = await this.appointmentsRepo.updateAppointmentStatus(
        id,
        nuevoEstado,
      );

      return {
        success: true,
        message: `Cita ${id} actualizada con éxito`,
        data: updated,
      };
    } catch (error) {
      console.error(
        `[Admin Error] Falló actualización de cita ${id}:`,
        error.message,
      );
      return {
        success: false,
        message:
          'No se pudo actualizar la cita. Verifique que el ID sea correcto.',
      };
    }
  }

  async getAppointmentsByBarber(barberId: number) {
    return await this.appointmentsRepo.findAppointmentsByBarber(barberId);
  }

  async createAppointment(datos: CreateAppointmentDto) {
    const id_servicio = Number(datos.id_servicio);
    const reservaData = {
      fecha: new Date(datos.fecha),
      observaciones: datos.observaciones,
      id_usuario: Number(datos.id_usuario),
      id_empleado: Number(datos.id_empleado),
      id_estado_cita: Number(datos.id_estado_cita),
      id_horarios: Number(datos.id_horarios),
    };

    let reserva: any;
    try {
      reserva = await this.appointmentsRepo.createAppointmentWithTransaction(
        reservaData,
        id_servicio,
      );
    } catch (error: any) {
      if (error.message === 'HORARIO_OCUPADO') {
        throw new BadRequestException(
          'Este horario ya no está disponible para el barbero seleccionado. Por favor, elige otra hora.',
        );
      }
      throw error;
    }

    // --- INTEGRACIÓN CON n8n ---
    try {
      const n8nWebhookUrl = 'http://elegant_n8n:5678/webhook/nueva-cita';

      const reservaAny = reserva as any;
      const datosAny = datos as any;

      // Buscar el email del cliente en la BD como respaldo
      const cliente = await this.usersService.getUserBasicInfo(
        Number(datosAny.id_usuario),
      );

      // Priorizar lo que el cliente escribió en el formulario, sino usar BD
      const emailFinal = datosAny.email_contacto || cliente?.email || '';
      const nombreFinal =
        datosAny.nombre_contacto ||
        `${cliente?.prim_nombre ?? ''} ${cliente?.apellido1 ?? ''}`.trim() ||
        'Cliente';

      const payload = {
        evento: 'NUEVA_CITA',
        id_reserva: reservaAny.id_reservas,
        cliente_id: datosAny.id_usuario,
        email_cliente: emailFinal,
        nombre_cliente: nombreFinal,
        fecha: datosAny.fecha,
        observaciones: datosAny.observaciones,
      };

      console.log('PAYLOAD PARA N8N:', payload);

      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(async (response) => {
          if (!response.ok) {
            const text = await response.text();
            console.warn(`n8n respondió con error ${response.status}:`, text);
          } else {
            console.log('🚀 Evento de cita enviado a n8n exitosamente');
          }
        })
        .catch((err) => console.error('Error de red enviando a n8n:', err));
    } catch (error) {
      console.warn('No se pudo enviar a n8n:', error);
    }
    return reserva;
  }

  async getAppointmentsByUser(userId: number) {
    try {
      const data = await this.appointmentsRepo.findAppointmentsByUser(userId);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      return { success: false, data: [] };
    }
  }

  async findOne(id: number) {
    const cita = await this.appointmentsRepo.findUniqueWithDetails(id);
    if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    return cita;
  }

  async update(id: number, data: any) {
    await this.findOne(id); // Verifica si existe

    // Si mandan una fecha en string, la parseamos a Date
    if (data.fecha) {
      data.fecha = new Date(data.fecha);
    }

    return await this.appointmentsRepo.updateAppointment(id, data);
  }

  // --- MÉTODO PARA REPROGRAMAR CITA (CLIENTE) ---
  async rescheduleAppointment(id: number, data: { userId: number; fecha: string; id_horarios: number; id_empleado?: number }) {
      const cita = await this.appointmentsRepo.findUniqueWithDetails(id);
      if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada`);

      if (cita.id_usuario !== data.userId) {
          throw new ForbiddenException('No puedes reprogramar una cita que no te pertenece');
      }

      if (cita.id_estado_cita !== 1) {
          throw new BadRequestException('Solo se pueden reprogramar citas en estado Pendiente');
      }

      // REGLA DE NEGOCIO: Fechas pasadas
      const nuevaFecha = new Date(data.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      if (nuevaFecha < hoy) {
          throw new BadRequestException('No se pueden reprogramar citas en fechas pasadas');
      }

      // REGLA DE NEGOCIO: Disponibilidad y cruce de horarios
      const idEmpleado = data.id_empleado || cita.id_empleado;
      const slotsDisponibles = await this.appointmentsRepo.getAvailableSlots(data.fecha, idEmpleado);
      const slotSeleccionado = slotsDisponibles.find(s => s.id === data.id_horarios);

      if (!slotSeleccionado) {
          throw new BadRequestException('El horario seleccionado no existe');
      }

      const cambiaFecha = nuevaFecha.toISOString().split('T')[0] !== cita.fecha.toISOString().split('T')[0];
      const cambiaEmpleado = idEmpleado !== cita.id_empleado;
      const cambiaHorario = data.id_horarios !== cita.id_horarios;

      if (!slotSeleccionado.isAvailable) {
          // Si el slot está ocupado, verificamos si es por esta misma cita o por otra.
          // Si el usuario intentó cambiar a una hora/fecha/empleado distinto y el slot está ocupado, denegamos.
          if (cambiaFecha || cambiaEmpleado || cambiaHorario) {
              throw new BadRequestException('El horario seleccionado ya no está disponible');
          }
      }

      const updateData: any = {
          fecha: nuevaFecha,
          id_horarios: data.id_horarios,
      };

      if (data.id_empleado) {
          updateData.id_empleado = data.id_empleado;
      }

      return this.appointmentsRepo.updateAppointment(id, updateData);
  }

  // --- MÉTODO PARA CANCELAR CITA (CLIENTE) ---
  async cancelAppointment(id: number, userId: number) {
      const cita = await this.appointmentsRepo.findUniqueWithDetails(id);
      if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada`);

      if (cita.id_usuario !== userId) {
          throw new ForbiddenException('No puedes cancelar una cita que no te pertenece');
      }

      if (cita.id_estado_cita !== 1) {
          throw new BadRequestException('Solo se pueden cancelar citas en estado Pendiente');
      }

      return this.appointmentsRepo.updateAppointment(id, { id_estado_cita: 3 });
  }

  // --- MÉTODO PARA RECORDATORIOS (n8n) ---
  async getTomorrowReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const citas = await this.appointmentsRepo.findTomorrowReminders(
      tomorrow,
      dayAfterTomorrow,
    );

    return citas.map((cita) => {
      // Formatear hora inicio (900 -> "9:00")
      let horaStr = cita.horarios?.hora_inicio?.toString() || '0000';
      if (horaStr.length === 3) horaStr = '0' + horaStr;
      const hh = horaStr.slice(0, 2);
      const mm = horaStr.slice(2, 4);

      return {
        id_reserva: cita.id_reservas,
        cliente_nombre:
          `${cita.usuarios?.prim_nombre ?? ''} ${cita.usuarios?.apellido1 ?? ''}`.trim() ||
          'Cliente',
        cliente_email: cita.usuarios?.email || '',
        fecha: cita.fecha.toISOString().split('T')[0],
        hora: `${hh}:${mm}`,
        servicio:
          cita.detalle_cita_servicio?.[0]?.servicios?.nombre ||
          'Servicio Barbería',
      };
    });
  }
}
