import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('G-007: Gestión Administrativa y Reportes (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let httpServer: any;
  let adminToken: string;
  let clientToken: string;
  let barberToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    // 1. Limpieza total de BD
    await prisma.detalle_cita_servicio.deleteMany();
    await prisma.pagos.deleteMany();
    await prisma.reservas.deleteMany();
    await prisma.barberos_servicios.deleteMany();
    await prisma.servicios.deleteMany();
    await prisma.categorias.deleteMany();
    await prisma.genero_servicio.deleteMany();
    await prisma.usuarios.deleteMany();
    await prisma.horarios.deleteMany();
    await prisma.estado_cita.deleteMany();

    // 2. Setup Roles y Estados
    await prisma.rol.upsert({ where: { id_rol: 1 }, update: {}, create: { id_rol: 1, nombre_rol: 'Admin' } });
    await prisma.rol.upsert({ where: { id_rol: 2 }, update: {}, create: { id_rol: 2, nombre_rol: 'Cliente' } });
    await prisma.rol.upsert({ where: { id_rol: 3 }, update: {}, create: { id_rol: 3, nombre_rol: 'Barbero' } });

    await prisma.estado_cita.upsert({ where: { id_estado_cita: 1 }, update: {}, create: { id_estado_cita: 1, confirmada: true } });
    await prisma.estado_cita.upsert({ where: { id_estado_cita: 2 }, update: {}, create: { id_estado_cita: 2, confirmada: true } }); // Completada

    // 3. Crear Usuarios (Admin, Cliente, Barbero)
    const hashedPass = await bcrypt.hash('Password123!', 10);
    const admin = await prisma.usuarios.create({
      data: {
        username: 'admin_g007', email: 'adming007@test.com', prim_nombre: 'Admin', apellido1: 'G007', password_hash: hashedPass, id_rol: 1, estado: true,
      } as any,
    });
    
    adminToken = jwtService.sign({ id: admin.id_usuario, id_usuario: admin.id_usuario, email: admin.email, role: 'admin', id_rol: 1 });

    const client = await prisma.usuarios.create({
      data: {
        username: 'cliente_g007', email: 'clienteg007@test.com', prim_nombre: 'Cliente', apellido1: 'G007', password_hash: hashedPass, id_rol: 2, estado: true,
      } as any,
    });
    
    clientToken = jwtService.sign({ id: client.id_usuario, id_usuario: client.id_usuario, email: client.email, role: 'cliente', id_rol: 2 });

    const barbero = await prisma.usuarios.create({
      data: {
        username: 'barbero_g007', email: 'barberog007@test.com', prim_nombre: 'Barbero', apellido1: 'G007', password_hash: hashedPass, id_rol: 3, estado: true,
      } as any,
    });
    
    barberToken = jwtService.sign({ id: barbero.id_usuario, id_usuario: barbero.id_usuario, email: barbero.email, role: 'barbero', id_rol: 3 });

    // 4. Crear un servicio de 50,000 para sumar ingresos
    const genero = await prisma.genero_servicio.create({ data: { nombre: 'Mixto' } });
    const categoria = await prisma.categorias.create({ data: { nombre: 'General', id_genero: genero.id_genero } });
    const servicio = await prisma.servicios.create({
      data: { nombre: 'Servicio VIP', precio: 50000, duracion: 60, id_categoria: categoria.id_categoria } as any,
    });

    const horario = await prisma.horarios.create({ data: { hora_inicio: 10, hora_fin: 11 } });

    // 5. Crear Citas Completadas (Una HOY y una hace un MES)
    const hoy = new Date();
    const haceUnMes = new Date();
    haceUnMes.setMonth(haceUnMes.getMonth() - 1);

    const reservaHoy = await prisma.reservas.create({
      data: { id_usuario: client.id_usuario, id_empleado: barbero.id_usuario, fecha: hoy, id_estado_cita: 2, id_horarios: horario.id_horarios } as any,
    });
    await prisma.detalle_cita_servicio.create({
      data: { id_reservas: reservaHoy.id_reservas, id_servicio: servicio.id_servicio } as any,
    });

    const reservaPasada = await prisma.reservas.create({
      data: { id_usuario: client.id_usuario, id_empleado: barbero.id_usuario, fecha: haceUnMes, id_estado_cita: 2, id_horarios: horario.id_horarios } as any,
    });
    await prisma.detalle_cita_servicio.create({
      data: { id_reservas: reservaPasada.id_reservas, id_servicio: servicio.id_servicio } as any,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Admin consulta las métricas exitosamente (Status 200)', async () => {
    const response = await request(httpServer)
      .get('/dashboard/stats')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toBeDefined();
    
    // Debería existir 1 cita completada hoy y 50,000 de ingresos de hoy
    expect(response.body.data.citasCompletadas).toBe(1);
    expect(response.body.data.ingresosHoy).toBe(50000);
  });

  it('2. Regla de Negocio (Bug Anticipado): Debe permitir filtrar métricas por un rango de fechas (Status 200)', async () => {
    // Si solicitamos métricas solo del mes pasado, la cita de hoy no debería sumar.
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);
    
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 15); // Hasta hace 15 días

    const response = await request(httpServer)
      .get(`/dashboard/stats?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    
    // Debería devolver los ingresos y citas del rango especificado (Hace 1 mes = 50,000 ingresos y 1 cita)
    // Actualmente el backend asume "HOY" hardcodeado y no lee las fechas, por lo que esto fallará.
    expect(response.body.data.ingresosHoy).toBe(50000);
    expect(response.body.data.citasCompletadas).toBe(1); // Si no filtra por fecha, devolverá 2 citas completadas y fallará.
  });

  it('3. Seguridad: Cliente no puede acceder al dashboard (Status 403 Forbidden)', async () => {
    const response = await request(httpServer)
      .get('/dashboard/stats')
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(403);
  });

  it('4. Seguridad: Barbero no puede acceder al dashboard (Status 403 Forbidden)', async () => {
    const response = await request(httpServer)
      .get('/dashboard/stats')
      .set('Authorization', `Bearer ${barberToken}`);

    expect(response.status).toBe(403);
  });
});
