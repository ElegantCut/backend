import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('RF-033: Listar Citas del Barbero (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;
  
  let barbero1Id: number;
  let barbero2Id: number;
  let clienteId: number;
  
  let fechaHoyStr: string;
  let fechaMananaStr: string;

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
    await prisma.reservas.deleteMany();
    await prisma.horarios.deleteMany();
    await prisma.servicios.deleteMany();
    await prisma.usuarios.deleteMany();
    
    // Roles
    await prisma.rol.upsert({ where: { id_rol: 2 }, update: {}, create: { id_rol: 2, nombre_rol: 'Cliente' } });
    await prisma.rol.upsert({ where: { id_rol: 3 }, update: {}, create: { id_rol: 3, nombre_rol: 'Barbero' } });

    // Estado Cita
    await prisma.estado_cita.upsert({ where: { id_estado_cita: 1 }, update: {}, create: { id_estado_cita: 1, confirmada: false } });

    // Usuarios
    const barbero1 = await prisma.usuarios.create({
      data: { username: 'barbero1_rf033', email: 'b1@rf033.com', telefono: '111', password_hash: 'hash', prim_nombre: 'Bar', apellido1: 'Uno', id_rol: 3 }
    });
    barbero1Id = barbero1.id_usuario;

    const barbero2 = await prisma.usuarios.create({
      data: { username: 'barbero2_rf033', email: 'b2@rf033.com', telefono: '222', password_hash: 'hash', prim_nombre: 'Bar', apellido1: 'Dos', id_rol: 3 }
    });
    barbero2Id = barbero2.id_usuario;

    const cliente = await prisma.usuarios.create({
      data: { username: 'cliente_rf033', email: 'cli@rf033.com', telefono: '333', password_hash: 'hash', prim_nombre: 'El', apellido1: 'Cliente', id_rol: 2 }
    });
    clienteId = cliente.id_usuario;

    // Horarios
    const h1 = await prisma.horarios.create({ data: { hora_inicio: 900, hora_fin: 930 } });
    const h2 = await prisma.horarios.create({ data: { hora_inicio: 1000, hora_fin: 1030 } });

    // Fechas
    const hoy = new Date();
    fechaHoyStr = hoy.toISOString().split('T')[0];

    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    fechaMananaStr = manana.toISOString().split('T')[0];

    // Cita 1: Barbero 1 (Hoy)
    await prisma.reservas.create({
      data: { fecha: hoy, id_usuario: clienteId, id_empleado: barbero1Id, id_estado_cita: 1, id_horarios: h1.id_horarios }
    });

    // Cita 2: Barbero 1 (Mañana)
    await prisma.reservas.create({
      data: { fecha: manana, id_usuario: clienteId, id_empleado: barbero1Id, id_estado_cita: 1, id_horarios: h2.id_horarios }
    });

    // Cita 3: Barbero 2 (Hoy) - Para validar que no se mezclen las citas
    await prisma.reservas.create({
      data: { fecha: hoy, id_usuario: clienteId, id_empleado: barbero2Id, id_estado_cita: 1, id_horarios: h1.id_horarios }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Obtener TODAS las citas del Barbero 1 sin mezclar con el Barbero 2 (Status 200)', async () => {
    const response = await request(httpServer).get(`/appointments/barber/${barbero1Id}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2); // Tiene 2 citas en total
    
    // Validar que todas pertenecen al barbero solicitado
    response.body.forEach((cita: any) => {
      expect(cita.id_empleado).toBe(barbero1Id);
    });
  });

  it('2. Regla de Negocio: Obtener citas del Barbero 1 FILTRADAS por la fecha de mañana (Status 200)', async () => {
    const response = await request(httpServer).get(`/appointments/barber/${barbero1Id}?date=${fechaMananaStr}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1); // Solo tiene 1 cita programada para mañana
    
    // Validar que la fecha coincida
    const cita = response.body[0];
    expect(cita.fecha).toMatch(new RegExp(`^${fechaMananaStr}`));
  });

  it('3. Regla de Negocio: Retornar lista vacía si el barbero no tiene citas en la fecha dada (Status 200)', async () => {
    const d = new Date();
    d.setDate(d.getDate() + 10); // Una fecha lejana
    const fechaVaciaStr = d.toISOString().split('T')[0];

    const response = await request(httpServer).get(`/appointments/barber/${barbero1Id}?date=${fechaVaciaStr}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});
