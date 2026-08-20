import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('RF-032: Completar Cita (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let httpServer: any;
  
  let barberoId: number;
  let adminId: number;
  let clienteId: number;
  
  let tokenBarbero: string;
  let tokenAdmin: string;
  let tokenCliente: string;
  
  let citaPendienteId: number;
  let citaCanceladaId: number;
  let citaCompletadaId: number;

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
    // Limpieza
    await prisma.detalle_cita_servicio.deleteMany();
    await prisma.reservas.deleteMany();
    await prisma.horarios.deleteMany();
    await prisma.servicios.deleteMany();
    await prisma.usuarios.deleteMany();
    
    // Roles
    await prisma.rol.upsert({ where: { id_rol: 1 }, update: {}, create: { id_rol: 1, nombre_rol: 'Admin' } });
    await prisma.rol.upsert({ where: { id_rol: 2 }, update: {}, create: { id_rol: 2, nombre_rol: 'Cliente' } });
    await prisma.rol.upsert({ where: { id_rol: 3 }, update: {}, create: { id_rol: 3, nombre_rol: 'Barbero' } });

    // Estados
    await prisma.estado_cita.upsert({ where: { id_estado_cita: 1 }, update: {}, create: { id_estado_cita: 1, confirmada: false } }); // Pendiente
    await prisma.estado_cita.upsert({ where: { id_estado_cita: 2 }, update: {}, create: { id_estado_cita: 2, confirmada: true } }); // Completada
    await prisma.estado_cita.upsert({ where: { id_estado_cita: 3 }, update: {}, create: { id_estado_cita: 3, confirmada: false } }); // Cancelada

    // Usuarios
    const admin = await prisma.usuarios.create({
      data: { username: 'admin_rf032', email: 'admin@rf032.com', telefono: '000', password_hash: 'hash', prim_nombre: 'El', apellido1: 'Admin', id_rol: 1 }
    });
    adminId = admin.id_usuario;

    const barbero = await prisma.usuarios.create({
      data: { username: 'barbero_rf032', email: 'barb@rf032.com', telefono: '111', password_hash: 'hash', prim_nombre: 'El', apellido1: 'Barbero', id_rol: 3 }
    });
    barberoId = barbero.id_usuario;

    const cliente = await prisma.usuarios.create({
      data: { username: 'cliente_rf032', email: 'cli@rf032.com', telefono: '222', password_hash: 'hash', prim_nombre: 'El', apellido1: 'Cliente', id_rol: 2 }
    });
    clienteId = cliente.id_usuario;

    // Tokens
    tokenAdmin = jwtService.sign({ id: adminId, id_usuario: adminId, email: admin.email, id_rol: 1 });
    tokenBarbero = jwtService.sign({ id: barberoId, id_usuario: barberoId, email: barbero.email, id_rol: 3 });
    tokenCliente = jwtService.sign({ id: clienteId, id_usuario: clienteId, email: cliente.email, id_rol: 2 });

    // Horarios
    const h1 = await prisma.horarios.create({ data: { hora_inicio: 800, hora_fin: 830 } });
    const h2 = await prisma.horarios.create({ data: { hora_inicio: 900, hora_fin: 930 } });
    const h3 = await prisma.horarios.create({ data: { hora_inicio: 1000, hora_fin: 1030 } });

    // Citas
    const fecha = new Date();
    const cita1 = await prisma.reservas.create({
      data: { fecha, id_usuario: clienteId, id_empleado: barberoId, id_estado_cita: 1, id_horarios: h1.id_horarios }
    });
    citaPendienteId = cita1.id_reservas;

    const cita2 = await prisma.reservas.create({
      data: { fecha, id_usuario: clienteId, id_empleado: barberoId, id_estado_cita: 3, id_horarios: h2.id_horarios }
    });
    citaCanceladaId = cita2.id_reservas;

    const cita3 = await prisma.reservas.create({
      data: { fecha, id_usuario: clienteId, id_empleado: barberoId, id_estado_cita: 2, id_horarios: h3.id_horarios }
    });
    citaCompletadaId = cita3.id_reservas;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Barbero completa cita en estado Pendiente (Status 200)', async () => {
    const response = await request(httpServer)
      .patch(`/appointments/admin/${citaPendienteId}/status`)
      .set('Authorization', `Bearer ${tokenBarbero}`)
      .send({ nuevoEstado: 2 }); // 2 = Completada

    expect(response.status).toBe(200);
    
    const citaActualizada = await prisma.reservas.findUnique({ where: { id_reservas: citaPendienteId } });
    expect(citaActualizada!.id_estado_cita).toBe(2);
  });

  it('2. Regla de Negocio: Rechazar completar una cita ya Cancelada (Status 400)', async () => {
    const response = await request(httpServer)
      .patch(`/appointments/admin/${citaCanceladaId}/status`)
      .set('Authorization', `Bearer ${tokenBarbero}`)
      .send({ nuevoEstado: 2 });

    expect(response.status).toBe(400); // El backend debe rechazar este cambio de estado
  });

  it('3. Regla de Negocio: Rechazar completar una cita ya Completada (Status 400)', async () => {
    const response = await request(httpServer)
      .patch(`/appointments/admin/${citaCompletadaId}/status`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({ nuevoEstado: 2 });

    expect(response.status).toBe(400); // El backend debe rechazar si ya estaba completada
  });

  it('4. Seguridad: Cliente no tiene permisos para acceder al endpoint (Status 403)', async () => {
    const response = await request(httpServer)
      .patch(`/appointments/admin/${citaPendienteId}/status`)
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send({ nuevoEstado: 2 });

    // El RoleGuard debe bloquear al cliente
    expect(response.status).toBe(403);
  });
});
