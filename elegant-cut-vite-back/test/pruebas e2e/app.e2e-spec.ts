import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';

import { AppModule } from '../../src/app.module';
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('App E2E Testing (Elegant-Cut)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;

  beforeAll(async () => 
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
    // LIMPIEZA DE BD: Borramos la tabla de usuarios antes de cada prueba (Arrange)
    await prisma.usuarios.deleteMany();

    // SETUP DE DATOS NECESARIOS (Foreign Keys)
    // Como la tabla de roles está vacía en la BD de pruebas, necesitamos insertar el rol con id 1
    // de lo contrario fallará por restricción de llave foránea al crear usuarios.
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

  describe('RF-001: Registro de Usuario', () => {

    const validRegisterPayload = {
      username: 'juanperez123',
      email: 'juan@test.com',
      telefono: '3001234567',
      password_hash: 'Password123!',
      prim_nombre: 'Juan',
      apellido1: 'Perez',
      id_rol: 1,
      estado: true
    };

    it('1. Camino Feliz: Debe registrar un usuario exitosamente (Status 201) y encriptar contraseña', async () => {
      const response = await request(httpServer)
        .post('/auth/register')
        .send(validRegisterPayload);

      expect(response.status).toBe(201);

      const userInDb = await prisma.usuarios.findFirst({
        where: { email: validRegisterPayload.email },
      });

      expect(userInDb).toBeDefined();
      expect(userInDb?.email).toBe(validRegisterPayload.email);
      expect(userInDb?.password_hash).not.toBe(validRegisterPayload.password_hash);
    });

    it('2. Regla de Negocio: Debe fallar si el email ya existe (Status 400 o 409)', async () => {
      await prisma.usuarios.create({
        data: {
          ...validRegisterPayload,
          password_hash: 'hash-cualquiera',
        } as any,
      });

      const response = await request(httpServer)
        .post('/auth/register')
        .send(validRegisterPayload);

      expect([400, 409]).toContain(response.status);
    });

    it('3. Validación DTO: Debe fallar si el email tiene mal formato (Status 400)', async () => {
      const invalidPayload = {
        ...validRegisterPayload,
        email: 'correo-sin-arroba',
      };

      const response = await request(httpServer)
        .post('/auth/register')
        .send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('correo')])
      );
    });

    it('4. Validación DTO: Debe fallar si la contraseña es muy corta (Status 400)', async () => {
      const invalidPayload = {
        ...validRegisterPayload,
        password_hash: '123',
      };

      const response = await request(httpServer)
        .post('/auth/register')
        .send(invalidPayload);

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('contraseña')])
      );
    });
  });
});
