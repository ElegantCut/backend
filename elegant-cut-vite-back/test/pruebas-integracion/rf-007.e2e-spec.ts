import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('RF-007: Disponibilidad de Horarios (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;
  
  let barberoId: number;
  let clienteId: number;
  let servicioId: number;
  let horario1Id: number;
  let horario2Id: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    httpServer = app.getHttpServer();
    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Limpieza
    await prisma.detalle_cita_servicio.deleteMany();
    await prisma.pagos.deleteMany();
    await prisma.reservas.deleteMany();
    await prisma.resenas.deleteMany();
    await prisma.barberos_servicios.deleteMany();
    await prisma.portafolios.deleteMany();
    await prisma.pqrs.deleteMany();
    await prisma.notificaciones.deleteMany();
    await prisma.codigos_verificacion.deleteMany();
    await prisma.cola_correos.deleteMany();
    await prisma.usuarios.deleteMany();
    
    // Roles y Estado Cita
    await prisma.rol.upsert({ where: { id_rol: 2 }, update: {}, create: { id_rol: 2, nombre_rol: 'Cliente' } });
    await prisma.rol.upsert({ where: { id_rol: 3 }, update: {}, create: { id_rol: 3, nombre_rol: 'Barbero' } });
    await prisma.estado_cita.upsert({ where: { id_estado_cita: 1 }, update: {}, create: { id_estado_cita: 1, confirmada: false } });

    // Barbero
    const barbero = await prisma.usuarios.create({
      data: {
        username: 'barbero_rf007', email: 'barb7@test.com', telefono: '000', password_hash: 'hash', prim_nombre: 'El', apellido1: 'Barbero', id_rol: 3, estado: true
      }
    });
    barberoId = barbero.id_usuario;

    // Cliente
    const cliente = await prisma.usuarios.create({
      data: {
        username: 'cliente_rf007', email: 'cli7@test.com', telefono: '111', password_hash: 'hash', prim_nombre: 'El', apellido1: 'Cliente', id_rol: 2, estado: true
      }
    });
    clienteId = cliente.id_usuario;

    // Servicio (Duración 30 mins)
    const servicio = await prisma.servicios.create({
      data: { nombre: 'Corte RF007', duracion: 30, precio: 20000 }
    });
    servicioId = servicio.id_servicio;

    // Horarios (2 slots: 9:00 AM y 9:30 AM)
    const h1 = await prisma.horarios.create({ data: { hora_inicio: 900, hora_fin: 930 } });
    horario1Id = h1.id_horarios;
    const h2 = await prisma.horarios.create({ data: { hora_inicio: 930, hora_fin: 1000 } });
    horario2Id = h2.id_horarios;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  // Para evitar bugs de Zona Horaria (Timezones) en las pruebas,
  // definimos fechas exactas y fijas que sabemos que caen en Lunes y Domingo.
  const getNextMonday = () => '2026-08-24'; // Lunes
  const getNextSunday = () => '2026-08-30'; // Domingo

  it('1. Camino Feliz: Todos los slots disponibles si el barbero no tiene citas (Status 200)', async () => {
    const mondayStr = getNextMonday();

    const response = await request(httpServer)
      .get(`/appointments/availability?date=${mondayStr}&barberId=${barberoId}`)
      .send();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Todos los horarios insertados deberían estar disponibles
    const slot1 = response.body.find((s: any) => s.id === horario1Id);
    const slot2 = response.body.find((s: any) => s.id === horario2Id);
    
    expect(slot1).toBeDefined();
    expect(slot1.isAvailable).toBe(true);
    expect(slot2).toBeDefined();
    expect(slot2.isAvailable).toBe(true);
  });

  it('2. Regla de Negocio: Un bloque de horario debe aparecer Ocupado si ya existe una cita (Status 200)', async () => {
    const mondayStr = getNextMonday();

    // Insertamos una reserva real en el horario 1 (9:00 AM)
    const reserva = await prisma.reservas.create({
      data: {
        fecha: new Date(mondayStr),
        id_usuario: clienteId,
        id_empleado: barberoId,
        id_estado_cita: 1, // Pendiente
        id_horarios: horario1Id,
        observaciones: 'Corte de prueba'
      }
    });
    await prisma.detalle_cita_servicio.create({
      data: { id_reservas: reserva.id_reservas, id_servicio: servicioId }
    });

    const response = await request(httpServer)
      .get(`/appointments/availability?date=${mondayStr}&barberId=${barberoId}`)
      .send();

    expect(response.status).toBe(200);
    
    const slot1 = response.body.find((s: any) => s.id === horario1Id);
    const slot2 = response.body.find((s: any) => s.id === horario2Id);
    
    // El slot 1 (9:00 AM) ahora debe estar OCUPADO
    expect(slot1.isAvailable).toBe(false);
    // El slot 2 (9:30 AM) debe estar LIBRE
    expect(slot2.isAvailable).toBe(true);
  });

  it('3. Regla de Negocio: Si es día de descanso (Domingo), debe retornar 0 slots disponibles (Status 200)', async () => {
    const sundayStr = getNextSunday();

    const response = await request(httpServer)
      .get(`/appointments/availability?date=${sundayStr}&barberId=${barberoId}`)
      .send();

    expect(response.status).toBe(200);
    // La lista debe estar vacía para bloquear reservas en días de descanso
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});
