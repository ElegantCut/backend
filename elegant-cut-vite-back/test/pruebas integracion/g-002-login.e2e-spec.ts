import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('G-002: Gestión de Autenticación - Login (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;

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
    // ARRANGE GENERAL: Limpieza de BD antes de cada prueba (orden inverso a FKs)
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

    // SETUP: Insertar Rol (Id 1 = Admin, Id 2 = Cliente, etc.)
    await prisma.rol.upsert({
      where: { id_rol: 1 },
      update: {},
      create: { id_rol: 1, nombre_rol: 'Admin' },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  const testUser = {
    username: 'testlogin',
    email: 'login@test.com',
    telefono: '3001234567',
    prim_nombre: 'Test',
    apellido1: 'Login',
    id_rol: 1,
    estado: true,
  };

  const plainPassword = 'PasswordSegura123!';

  it('1. Camino Feliz: Debe iniciar sesión exitosamente y retornar token (Status 201/200)', async () => {
    // ARRANGE: Crear el usuario válido en la BD con contraseña encriptada
    const hashed = await bcrypt.hash(plainPassword, 10);
    await prisma.usuarios.create({
      data: { ...testUser, password_hash: hashed } as any,
    });

    // ACT: Intentar hacer login
    const response = await request(httpServer)
      .post('/auth/login')
      .send({
        username: testUser.username,
        contrasena: plainPassword,
      });

    // ASSERT: Validar que sea un login exitoso
    expect([200, 201]).toContain(response.status);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(testUser.email);
    
    // Validar que se haya seteado la cookie 'jwt'
    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();
    expect(cookies.some((cookie: string) => cookie.includes('jwt='))).toBe(true);
  });

  it('2. Regla de Negocio: Debe fallar si la contraseña es incorrecta (Status 401)', async () => {
    // ARRANGE: Crear el usuario válido
    const hashed = await bcrypt.hash(plainPassword, 10);
    await prisma.usuarios.create({
      data: { ...testUser, password_hash: hashed } as any,
    });

    // ACT: Intentar hacer login con mala contraseña
    const response = await request(httpServer)
      .post('/auth/login')
      .send({
        username: testUser.username,
        contrasena: 'PasswordEquivocada!',
      });

    // ASSERT
    expect(response.status).toBe(401);
  });

  it('3. Regla de Negocio: Debe fallar si el usuario no existe (Status 404 o 401)', async () => {
    // ACT: Intentar hacer login sin haber creado el usuario en la BD (Arrange vacío)
    const response = await request(httpServer)
      .post('/auth/login')
      .send({
        username: 'usuario_inexistente',
        contrasena: plainPassword,
      });

    // ASSERT: Generalmente NotFound o Unauthorized
    expect([401, 404]).toContain(response.status);
  });

  it('4. Validación DTO: Debe fallar si no se envía el username (Status 400)', async () => {
    // ACT
    const response = await request(httpServer)
      .post('/auth/login')
      .send({
        // username omitido
        contrasena: plainPassword,
      });

    // ASSERT
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('username') || expect.stringContaining('usuario')])
    );
  });

  it('5. Validación DTO: Debe fallar si no se envía la contraseña (Status 400)', async () => {
    // ACT
    const response = await request(httpServer)
      .post('/auth/login')
      .send({
        username: testUser.username,
        // contrasena omitida
      });

    // ASSERT
    expect(response.status).toBe(400);
  });
});
