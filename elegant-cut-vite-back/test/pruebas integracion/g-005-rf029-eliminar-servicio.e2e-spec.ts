import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('G-005: Gestión de Servicios - RF-029 Eliminar Servicio (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let httpServer: any;
  let adminToken: string;
  let clientToken: string;
  let servicioLibreId: number;
  let servicioConCitasId: number;

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

    // 3. Crear Admin, Cliente y Barbero
    const hashedPass = await bcrypt.hash('Password123!', 10);
    const admin = await prisma.usuarios.create({
      data: {
        username: 'admin_rf029',
        email: 'adminrf029@test.com',
        prim_nombre: 'Admin',
        apellido1: 'RF029',
        password_hash: hashedPass,
        id_rol: 1,
        estado: true,
      } as any,
    });
    
    adminToken = jwtService.sign({
      id: admin.id_usuario,
      id_usuario: admin.id_usuario,
      email: admin.email,
      role: 'admin',
      id_rol: 1,
    });

    const client = await prisma.usuarios.create({
      data: {
        username: 'cliente_rf029',
        email: 'clienterf029@test.com',
        prim_nombre: 'Cliente',
        apellido1: 'RF029',
        password_hash: hashedPass,
        id_rol: 2,
        estado: true,
      } as any,
    });
    
    clientToken = jwtService.sign({
      id: client.id_usuario,
      id_usuario: client.id_usuario,
      email: client.email,
      role: 'cliente',
      id_rol: 2,
    });

    const barbero = await prisma.usuarios.create({
      data: {
        username: 'barbero_rf029',
        email: 'barberorf029@test.com',
        prim_nombre: 'Barbero',
        apellido1: 'RF029',
        password_hash: hashedPass,
        id_rol: 3,
        estado: true,
      } as any,
    });

    // 4. Crear Categorías
    const genero = await prisma.genero_servicio.create({ data: { nombre: 'Mixto' } });
    const categoria = await prisma.categorias.create({ data: { nombre: 'General', id_genero: genero.id_genero } });

    // 5. Crear 2 Servicios: Uno libre y otro con cita
    const servicioLibre = await prisma.servicios.create({
      data: {
        nombre: 'Servicio Libre',
        precio: 10000,
        duracion: 30,
        id_categoria: categoria.id_categoria,
      } as any,
    });
    servicioLibreId = servicioLibre.id_servicio;

    const servicioConCitas = await prisma.servicios.create({
      data: {
        nombre: 'Servicio Ocupado',
        precio: 20000,
        duracion: 60,
        id_categoria: categoria.id_categoria,
      } as any,
    });
    servicioConCitasId = servicioConCitas.id_servicio;

    // 6. Agendar una cita futura para el Servicio Ocupado
    const fechaFutura = new Date();
    fechaFutura.setDate(fechaFutura.getDate() + 5);

    const horario = await prisma.horarios.create({
      data: { hora_inicio: 14, hora_fin: 15 }
    });

    const reserva = await prisma.reservas.create({
      data: {
        id_usuario: client.id_usuario,
        id_empleado: barbero.id_usuario,
        fecha: fechaFutura,
        id_estado_cita: 1,
        id_horarios: horario.id_horarios,
      } as any,
    });

    await prisma.detalle_cita_servicio.create({
      data: {
        id_reserva: reserva.id_reserva,
        id_servicio: servicioConCitas.id_servicio,
      } as any,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Admin debe poder eliminar un servicio que NO tiene citas vinculadas (Status 200)', async () => {
    const response = await request(httpServer)
      .delete(`/services/${servicioLibreId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);

    // Validar en la BD que fue eliminado
    const s = await prisma.servicios.findUnique({ where: { id_servicio: servicioLibreId } });
    expect(s).toBeNull();
  });

  it('2. Regla de Negocio (Bug Anticipado): No se puede eliminar un servicio con citas futuras (Status 400)', async () => {
    const response = await request(httpServer)
      .delete(`/services/${servicioConCitasId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    // La regla exige que responda con HTTP 400 Bad Request
    // Si el backend lo envuelve en un Try/Catch y devuelve Status 200 con { success: false }, el test fallará.
    expect(response.status).toBe(400);
  });

  it('3. Seguridad: Cliente no puede eliminar servicios (Status 403 Forbidden)', async () => {
    const response = await request(httpServer)
      .delete(`/services/${servicioLibreId}`)
      .set('Authorization', `Bearer ${clientToken}`);

    expect(response.status).toBe(403);
  });
});
