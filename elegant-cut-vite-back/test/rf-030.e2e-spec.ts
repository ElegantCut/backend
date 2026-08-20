import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('RF-030: Cancelar Cita (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let httpServer: any;
  
  let cliente1Id: number;
  let cliente2Id: number;
  let tokenCliente1: string;
  let tokenCliente2: string;
  
  let citaPendienteId: number;
  let citaCompletadaId: number;
  let citaCanceladaId: number;

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
    
    // Configuración Base
    await prisma.rol.upsert({ where: { id_rol: 2 }, update: {}, create: { id_rol: 2, nombre_rol: 'Cliente' } });
    await prisma.rol.upsert({ where: { id_rol: 3 }, update: {}, create: { id_rol: 3, nombre_rol: 'Barbero' } });

    // Estados de Cita
    await prisma.estado_cita.upsert({ where: { id_estado_cita: 1 }, update: {}, create: { id_estado_cita: 1, confirmada: false } });
    await prisma.estado_cita.upsert({ where: { id_estado_cita: 2 }, update: {}, create: { id_estado_cita: 2, confirmada: true } });
    await prisma.estado_cita.upsert({ where: { id_estado_cita: 3 }, update: {}, create: { id_estado_cita: 3, confirmada: false } });

    // Crear Clientes y Barbero
    const barbero = await prisma.usuarios.create({
      data: { username: 'barbero_rf030', email: 'barb@rf030.com', telefono: '000', password_hash: 'hash', prim_nombre: 'El', apellido1: 'Barbero', id_rol: 3 }
    });

    const cliente1 = await prisma.usuarios.create({
      data: { username: 'cliente1_rf030', email: 'c1@rf030.com', telefono: '111', password_hash: 'hash', prim_nombre: 'Cli', apellido1: 'Uno', id_rol: 2 }
    });
    cliente1Id = cliente1.id_usuario;

    const cliente2 = await prisma.usuarios.create({
      data: { username: 'cliente2_rf030', email: 'c2@rf030.com', telefono: '222', password_hash: 'hash', prim_nombre: 'Cli', apellido1: 'Dos', id_rol: 2 }
    });
    cliente2Id = cliente2.id_usuario;

    // Tokens
    tokenCliente1 = jwtService.sign({ id: cliente1Id, id_usuario: cliente1Id, email: cliente1.email, id_rol: 2 });
    tokenCliente2 = jwtService.sign({ id: cliente2Id, id_usuario: cliente2Id, email: cliente2.email, id_rol: 2 });

    // Horarios ficticios
    const h1 = await prisma.horarios.create({ data: { hora_inicio: 900, hora_fin: 930 } });
    const h2 = await prisma.horarios.create({ data: { hora_inicio: 930, hora_fin: 1000 } });
    const h3 = await prisma.horarios.create({ data: { hora_inicio: 1000, hora_fin: 1030 } });

    // Citas para Cliente 1 en diferentes estados
    const cita1 = await prisma.reservas.create({
      data: { fecha: new Date(), id_usuario: cliente1Id, id_empleado: barbero.id_usuario, id_estado_cita: 1, id_horarios: h1.id_horarios }
    });
    citaPendienteId = cita1.id_reservas;

    const cita2 = await prisma.reservas.create({
      data: { fecha: new Date(), id_usuario: cliente1Id, id_empleado: barbero.id_usuario, id_estado_cita: 2, id_horarios: h2.id_horarios }
    });
    citaCompletadaId = cita2.id_reservas;

    const cita3 = await prisma.reservas.create({
      data: { fecha: new Date(), id_usuario: cliente1Id, id_empleado: barbero.id_usuario, id_estado_cita: 3, id_horarios: h3.id_horarios }
    });
    citaCanceladaId = cita3.id_reservas;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Cliente cancela su propia cita en estado Pendiente (Status 200)', async () => {
    const response = await request(httpServer)
      .patch(`/appointments/${citaPendienteId}/cancel`)
      .set('Authorization', `Bearer ${tokenCliente1}`)
      .send({ userId: cliente1Id });

    expect(response.status).toBe(200);
    
    // Verificar en BD que cambió a estado 3 (Cancelada)
    const citaActualizada = await prisma.reservas.findUnique({ where: { id_reservas: citaPendienteId } });
    expect(citaActualizada!.id_estado_cita).toBe(3);
  });

  it('2. Regla de Negocio: Rechazar cancelación de una cita ya Completada (Status 400)', async () => {
    const response = await request(httpServer)
      .patch(`/appointments/${citaCompletadaId}/cancel`)
      .set('Authorization', `Bearer ${tokenCliente1}`)
      .send({ userId: cliente1Id });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Solo se pueden cancelar citas en estado Pendiente/i);
  });

  it('3. Regla de Negocio: Rechazar cancelación de una cita ya Cancelada (Status 400)', async () => {
    const response = await request(httpServer)
      .patch(`/appointments/${citaCanceladaId}/cancel`)
      .set('Authorization', `Bearer ${tokenCliente1}`)
      .send({ userId: cliente1Id });

    expect(response.status).toBe(400);
    expect(response.body.message).toMatch(/Solo se pueden cancelar citas en estado Pendiente/i);
  });

  it('4. Seguridad: Cliente 2 no puede cancelar la cita del Cliente 1 (Status 403 Forbidden)', async () => {
    // Cliente 2 intenta cancelar la cita que le pertenece al Cliente 1
    const response = await request(httpServer)
      .patch(`/appointments/${citaPendienteId}/cancel`)
      .set('Authorization', `Bearer ${tokenCliente2}`)
      .send({ userId: cliente2Id });

    expect(response.status).toBe(403);
    expect(response.body.message).toMatch(/No puedes cancelar una cita que no te pertenece/i);
    
    // Verificamos que la BD no haya sido alterada maliciosamente
    const citaIntacta = await prisma.reservas.findUnique({ where: { id_reservas: citaPendienteId } });
    expect(citaIntacta!.id_estado_cita).toBe(1); // Sigue pendiente
  });
});
