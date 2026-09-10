import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('G-003: Gestión de Barberos - RF-017 (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;
  let adminToken: string;
  let clientToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Habilitar ValidationPipe para probar los DTOs (Errores 400)
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
    // 1. LIMPIEZA DE BD (Orden inverso a FKs)
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

    // 2. SETUP DE ROLES
    await prisma.rol.upsert({ where: { id_rol: 1 }, update: {}, create: { id_rol: 1, nombre_rol: 'Admin' } });
    await prisma.rol.upsert({ where: { id_rol: 2 }, update: {}, create: { id_rol: 2, nombre_rol: 'Cliente' } });
    await prisma.rol.upsert({ where: { id_rol: 3 }, update: {}, create: { id_rol: 3, nombre_rol: 'Barbero' } });

    // 3. CREAR USUARIO ADMIN Y OBTENER SU TOKEN
    const hashedAdmin = await bcrypt.hash('AdminPass123!', 10);
    const adminUser = await prisma.usuarios.create({
      data: {
        username: 'adminTest',
        email: 'admin@elegantcut.com',
        prim_nombre: 'Admin',
        apellido1: 'Root',
        password_hash: hashedAdmin,
        id_rol: 1, // ADMIN
        estado: true,
      } as any,
    });

    const loginAdminRes = await request(httpServer).post('/auth/login').send({
      username: adminUser.username,
      contrasena: 'AdminPass123!',
    });
    adminToken = loginAdminRes.body.token;

    // 4. CREAR USUARIO CLIENTE (Para probar bloqueos de permisos)
    const hashedClient = await bcrypt.hash('ClientPass123!', 10);
    const clientUser = await prisma.usuarios.create({
      data: {
        username: 'clientTest',
        email: 'cliente@test.com',
        prim_nombre: 'Cliente',
        apellido1: 'Regular',
        password_hash: hashedClient,
        id_rol: 2, // CLIENTE
        estado: true,
      } as any,
    });

    const loginClientRes = await request(httpServer).post('/auth/login').send({
      username: clientUser.username,
      contrasena: 'ClientPass123!',
    });
    clientToken = loginClientRes.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  const validBarberPayload = {
    prim_nombre: 'Pedro',
    apellido1: 'Martinez',
    email: 'pedro.barber@test.com',
    password_hash: 'PasswordBarbero123!',
    telefono: '3001112233',
    // Otros campos opcionales
  };

  it('1. Camino Feliz: Admin debe poder registrar un barbero exitosamente (Status 201/200)', async () => {
    const response = await request(httpServer)
      .post('/barbers')
      .set('Authorization', `Bearer ${adminToken}`) // Autenticado como Admin
      .send(validBarberPayload);

    // En NestJS por defecto un POST exitoso retorna 201 (Created)
    expect([200, 201]).toContain(response.status);
    expect(response.body.success).toBe(true);

    // Validar que se creó realmente en la base de datos con rol 3
    const barberInDb = await prisma.usuarios.findFirst({
      where: { email: validBarberPayload.email },
    });

    expect(barberInDb).toBeDefined();
    expect(barberInDb?.id_rol).toBe(3); // Debe ser creado con rol de Barbero
  });

  it('2. Regla de Negocio: Debe fallar si el email ya existe (Status 400 o catch interno)', async () => {
    // ARRANGE: Crear un usuario existente que ocupa el email
    await prisma.usuarios.create({
      data: {
        username: 'ocupado',
        email: validBarberPayload.email,
        prim_nombre: 'Otro',
        apellido1: 'Usuario',
        id_rol: 3,
        estado: true,
      } as any,
    });

    // ACT: Intentar registrar el barbero con el mismo correo
    const response = await request(httpServer)
      .post('/barbers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validBarberPayload);

    // ASSERT: Dependiendo de cómo lo maneje el Controller, puede devolver 400 o 200 con success: false (debido al try-catch)
    if (response.status === 200 || response.status === 201) {
      expect(response.body.success).toBe(false);
    } else {
      expect([400, 409, 500]).toContain(response.status);
    }
  });

  it('3. Regla de Negocio: Solo el administrador puede crear barberos (Status 403 Forbidden)', async () => {
    // ACT: Intentar hacer la misma petición pero usando el token de un CLIENTE (rol 2)
    const response = await request(httpServer)
      .post('/barbers')
      .set('Authorization', `Bearer ${clientToken}`) // <-- Token de Cliente!
      .send(validBarberPayload);

    // ASSERT: Debe ser rechazado por RolesGuard
    expect(response.status).toBe(403);
  });

  it('4. Validación DTO: Debe fallar si el correo no tiene formato válido (Status 400)', async () => {
    const invalidPayload = {
      ...validBarberPayload,
      email: 'correo-sin-arroba',
    };

    const response = await request(httpServer)
      .post('/barbers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(invalidPayload);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('correo')])
    );
  });

  it('5. Validación DTO: Debe fallar si el nombre tiene caracteres especiales (Status 400)', async () => {
    const invalidPayload = {
      ...validBarberPayload,
      prim_nombre: 'Pedro#123', // Regex lo debe rechazar
    };

    const response = await request(httpServer)
      .post('/barbers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(invalidPayload);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('caracteres especiales')])
    );
  });
});
