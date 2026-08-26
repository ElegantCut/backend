import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('G-003: Gestión de Barberos - RF-025 Activación de Empleados (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let httpServer: any;
  let adminToken: string;
  let clientToken: string;
  let barberoId: number;

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
    // 1. Limpieza de BD
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

    // 2. Setup Roles
    await prisma.rol.upsert({ where: { id_rol: 1 }, update: {}, create: { id_rol: 1, nombre_rol: 'Admin' } });
    await prisma.rol.upsert({ where: { id_rol: 2 }, update: {}, create: { id_rol: 2, nombre_rol: 'Cliente' } });
    await prisma.rol.upsert({ where: { id_rol: 3 }, update: {}, create: { id_rol: 3, nombre_rol: 'Barbero' } });

    // 3. Crear Admin
    const hashedPass = await bcrypt.hash('Password123!', 10);
    const admin = await prisma.usuarios.create({
      data: {
        username: 'adminrf025',
        email: 'adminrf025@test.com',
        prim_nombre: 'Admin',
        apellido1: 'RF025',
        password_hash: hashedPass,
        id_rol: 1,
        estado: true,
      } as any,
    });
    
    // Obtener Token Admin (Formato del Payload de Login)
    adminToken = jwtService.sign({
      id: admin.id_usuario,
      id_usuario: admin.id_usuario,
      email: admin.email,
      role: 'admin',
      id_rol: 1,
    });

    // 4. Crear Cliente
    const client = await prisma.usuarios.create({
      data: {
        username: 'clientrf025',
        email: 'clientrf025@test.com',
        prim_nombre: 'Client',
        apellido1: 'RF025',
        password_hash: hashedPass,
        id_rol: 2,
        estado: true,
      } as any,
    });
    
    // Obtener Token Cliente
    clientToken = jwtService.sign({
      id: client.id_usuario,
      id_usuario: client.id_usuario,
      email: client.email,
      role: 'cliente',
      id_rol: 2,
    });

    // 5. Crear Barbero de Prueba ACTIVO
    const barbero = await prisma.usuarios.create({
      data: {
        username: 'barbero_rf025',
        email: 'barberorf025@test.com',
        prim_nombre: 'Barbero',
        apellido1: 'RF025',
        password_hash: hashedPass,
        id_rol: 3,
        estado: true, // Inicialmente Activo
      } as any,
    });
    barberoId = barbero.id_usuario;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Regla de Negocio: Solo el Administrador puede cambiar el estado (Status 403 Forbidden para Cliente)', async () => {
    const response = await request(httpServer)
      .put(`/barbers/${barberoId}/toggle`)
      .set('Authorization', `Bearer ${clientToken}`); // Token de Cliente

    // El sistema debe prohibir el acceso
    expect(response.status).toBe(403);
  });

  it('2. Camino Feliz: El administrador puede desactivar y luego volver a activar a un empleado (Status 200)', async () => {
    // A. Desactivar
    const responseDeactivate = await request(httpServer)
      .put(`/barbers/${barberoId}/toggle`)
      .set('Authorization', `Bearer ${adminToken}`); // Token de Admin

    expect(responseDeactivate.status).toBe(200);
    expect(responseDeactivate.body.success).toBe(true);
    expect(responseDeactivate.body.newStatus).toBe(false);

    // Verificar en BD
    let barberoEnDb = await prisma.usuarios.findUnique({ where: { id_usuario: barberoId } });
    expect(barberoEnDb?.estado).toBe(false);

    // B. Volver a Activar
    const responseActivate = await request(httpServer)
      .put(`/barbers/${barberoId}/toggle`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(responseActivate.status).toBe(200);
    expect(responseActivate.body.success).toBe(true);
    expect(responseActivate.body.newStatus).toBe(true);

    // Verificar en BD
    barberoEnDb = await prisma.usuarios.findUnique({ where: { id_usuario: barberoId } });
    expect(barberoEnDb?.estado).toBe(true);
  });

  it('3. Regla de Negocio: Un barbero desactivado NO debe aparecer en las listas públicas', async () => {
    // Primero nos aseguramos de desactivarlo con el Admin
    await request(httpServer)
      .put(`/barbers/${barberoId}/toggle`)
      .set('Authorization', `Bearer ${adminToken}`);

    // Ahora intentamos consultar la lista pública
    const publicListResponse = await request(httpServer).get('/barbers/public');
    
    // Verificamos que el barbero desactivado no esté en el arreglo
    const barberoEnLista = publicListResponse.body.find((b: any) => b.id_usuario === barberoId);
    expect(barberoEnLista).toBeUndefined();
  });
});
