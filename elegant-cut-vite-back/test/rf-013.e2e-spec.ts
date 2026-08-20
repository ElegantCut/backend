import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { OAuth2Client } from 'google-auth-library';

// MOCK: Interceptamos la librería de Google ANTES de que NestJS arranque
const mockVerifyIdToken = jest.fn();

jest.mock('google-auth-library', () => {
  return {
    OAuth2Client: jest.fn().mockImplementation(() => {
      return {
        verifyIdToken: mockVerifyIdToken,
      };
    }),
  };
});

describe('RF-013: Autenticación con Google (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;

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
    // 1. Limpiamos las memorias de los mocks
    jest.clearAllMocks();
    
    // 2. Limpiamos la Base de Datos
    await prisma.usuarios.deleteMany();
    await prisma.rol.upsert({
      where: { id_rol: 1 },
      update: {},
      create: { id_rol: 1, nombre_rol: 'Admin' },
    });
    await prisma.rol.upsert({
      where: { id_rol: 2 },
      update: {},
      create: { id_rol: 2, nombre_rol: 'Cliente' }, // Por defecto se asigna rol 2 a clientes
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Crear cuenta nueva automáticamente si el correo no existe (Status 200/201)', async () => {
    // ARRANGE: Engañamos a NestJS para que crea que Google respondió exitosamente
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        email: 'nuevo.cliente@gmail.com',
        given_name: 'Juan',
        family_name: 'Google',
        sub: 'google-id-123456789',
        picture: 'https://foto.com/perfil.jpg'
      })
    });

    // ACT: Simulamos la petición del Frontend mandando el token (que no importa porque está mockeado)
    const response = await request(httpServer)
      .post('/auth/google')
      .send({ token: 'fake-jwt-token' });

    // ASSERT HTTP
    expect([200, 201]).toContain(response.status);
    expect(response.body.token).toBeDefined();

    // ASSERT BD: Vamos a MySQL a verificar que se insertó el usuario
    const userInDb = await prisma.usuarios.findFirst({
      where: { email: 'nuevo.cliente@gmail.com' }
    });
    
    expect(userInDb).toBeDefined();
    expect(userInDb!.google_id).toBe('google-id-123456789'); // Validamos que se guardó su referencia
    expect(userInDb!.prim_nombre).toBe('Juan'); // Validamos mapeo de nombre
    expect(userInDb!.foto_perfil).toBe('https://foto.com/perfil.jpg');
  });

  it('2. Regla de Negocio: Fusionar cuenta si el correo ya estaba registrado manualmente (Status 200/201)', async () => {
    // ARRANGE 1: Creamos un usuario manual en BD (sin google_id, porque se registró con correo/password)
    await prisma.usuarios.create({
      data: {
        username: 'mariajose123',
        email: 'maria.fusion@test.com',
        telefono: '300000000',
        password_hash: 'hash-password',
        prim_nombre: 'Maria',
        apellido1: 'Jose',
        id_rol: 2,
        estado: true
      }
    });

    // ARRANGE 2: Mockeamos que Google responde con ese MISMO correo
    mockVerifyIdToken.mockResolvedValue({
      getPayload: () => ({
        email: 'maria.fusion@test.com', // ¡Mismo correo!
        given_name: 'Maria Google',
        family_name: 'Jose',
        sub: 'google-id-fusion-999',
      })
    });

    // ACT: Maria intenta hacer "Log In with Google"
    const response = await request(httpServer)
      .post('/auth/google')
      .send({ token: 'fake-jwt-token' });

    // ASSERT HTTP
    expect([200, 201]).toContain(response.status);

    // ASSERT BD: El sistema NO debe crear un duplicado, debe actualizar el existente
    const users = await prisma.usuarios.findMany({
      where: { email: 'maria.fusion@test.com' }
    });
    
    // Regla de oro: No hay duplicados
    expect(users.length).toBe(1);
    
    // Regla de fusión: Ahora el usuario antiguo tiene su google_id asignado
    expect(users[0].google_id).toBe('google-id-fusion-999');
  });

  it('3. Regla de Negocio: Rechazar la petición si el token de Google está manipulado (Status 401)', async () => {
    // ARRANGE: Simulamos que la librería oficial de Google tira un error porque el token es falso
    mockVerifyIdToken.mockRejectedValue(new Error('Invalid token signature'));

    // ACT
    const response = await request(httpServer)
      .post('/auth/google')
      .send({ token: 'token-hackeado' });

    // ASSERT HTTP: El servidor debe rechazar la intrusión
    expect([400, 401]).toContain(response.status);
  });
});
