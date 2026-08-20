import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('RF-006: Agendamiento de Citas (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let httpServer: any;
  let userToken: string;
  
  let clienteId: number;
  let barberoId: number;
  let servicioId: number;
  let horarioId: number;

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
    jwtService = app.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    // Limpieza de tablas dependientes
    await prisma.detalle_cita_servicio.deleteMany();
    await prisma.reservas.deleteMany();
    await prisma.usuarios.deleteMany();
    
    // Roles necesarios
    await prisma.rol.upsert({ where: { id_rol: 2 }, update: {}, create: { id_rol: 2, nombre_rol: 'Cliente' } });
    await prisma.rol.upsert({ where: { id_rol: 3 }, update: {}, create: { id_rol: 3, nombre_rol: 'Barbero' } });

    // Estado Cita necesario
    await prisma.estado_cita.upsert({ where: { id_estado_cita: 1 }, update: {}, create: { id_estado_cita: 1, confirmada: false } });

    // Crear Barbero
    const barbero = await prisma.usuarios.create({
      data: {
        username: 'barbero_pro',
        email: 'barbero@test.com',
        telefono: '3000000000',
        password_hash: 'hash',
        prim_nombre: 'El',
        apellido1: 'Barbero',
        id_rol: 3,
        estado: true
      }
    });
    barberoId = barbero.id_usuario;

    // Crear Cliente
    const cliente = await prisma.usuarios.create({
      data: {
        username: 'cliente_vip',
        email: 'cliente@test.com',
        telefono: '3111111111',
        password_hash: 'hash',
        prim_nombre: 'Soy',
        apellido1: 'Cliente',
        id_rol: 2,
        estado: true
      }
    });
    clienteId = cliente.id_usuario;

    // Generar Token Real para el Cliente
    userToken = jwtService.sign({
      id: cliente.id_usuario,
      id_usuario: cliente.id_usuario,
      email: cliente.email,
      role: 'cliente',
      id_rol: 2
    });

    // Asegurar que exista un servicio de prueba
    const servicio = await prisma.servicios.upsert({
      where: { id_servicio: 1 },
      update: {},
      create: { id_servicio: 1, nombre: 'Corte Clásico', duracion: 30, precio: 20000 }
    });
    servicioId = servicio.id_servicio;

    // Asegurar que exista un horario de prueba (ej: 09:00 AM -> 900)
    const horario = await prisma.horarios.upsert({
      where: { id_horarios: 1 },
      update: {},
      create: { id_horarios: 1, hora_inicio: 900, hora_fin: 930 }
    });
    horarioId = horario.id_horarios;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Debe permitir agendar una cita correctamente en fecha válida (Status 201)', async () => {
    // Calculamos una fecha futura (mañana)
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    const fechaFuturaStr = mañana.toISOString().split('T')[0];

    const payload = {
      fecha: fechaFuturaStr,
      id_usuario: clienteId,
      id_empleado: barberoId,
      id_estado_cita: 1,
      id_horarios: horarioId,
      id_servicio: servicioId,
      observaciones: 'Llegaré 5 mins antes',
      nombre_contacto: 'Soy Cliente VIP',
      email_contacto: 'cliente@test.com'
    };

    const response = await request(httpServer)
      .post('/appointments')
      .set('Authorization', `Bearer ${userToken}`)
      .send(payload);

    expect(response.status).toBe(201);
    
    // Verificamos en DB
    const reservaEnDb = await prisma.reservas.findFirst({
      where: { id_usuario: clienteId, id_empleado: barberoId }
    });
    expect(reservaEnDb).toBeDefined();
    expect(reservaEnDb!.observaciones).toBe('Llegaré 5 mins antes');
  });

  it('2. Regla de Negocio: Debe rechazar agendamiento en fechas pasadas (Status 400)', async () => {
    // Fecha de ayer
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const fechaPasadaStr = ayer.toISOString().split('T')[0];

    const payload = {
      fecha: fechaPasadaStr,
      id_usuario: clienteId,
      id_empleado: barberoId,
      id_estado_cita: 1,
      id_horarios: horarioId,
      id_servicio: servicioId
    };

    const response = await request(httpServer)
      .post('/appointments')
      .set('Authorization', `Bearer ${userToken}`)
      .send(payload);

    // Esperamos que el backend lance un error 400
    expect(response.status).toBe(400);
  });

  it('3. Regla de Negocio: Debe denegar agendamiento si el horario ya está ocupado simultáneamente (Status 400)', async () => {
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    const fechaStr = mañana.toISOString().split('T')[0];

    const payload = {
      fecha: fechaStr,
      id_usuario: clienteId,
      id_empleado: barberoId,
      id_estado_cita: 1,
      id_horarios: horarioId,
      id_servicio: servicioId
    };

    // 1. Primer cliente agenda la cita exitosamente
    const response1 = await request(httpServer)
      .post('/appointments')
      .set('Authorization', `Bearer ${userToken}`)
      .send(payload);
    
    expect(response1.status).toBe(201);

    // 2. Otro cliente intenta agendar exactamente el mismo slot
    const response2 = await request(httpServer)
      .post('/appointments')
      .set('Authorization', `Bearer ${userToken}`)
      .send(payload);
    
    // El backend debe atrapar el solapamiento y rechazarlo
    expect(response2.status).toBe(400);
  });
});
