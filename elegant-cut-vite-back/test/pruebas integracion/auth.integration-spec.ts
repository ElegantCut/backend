import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('G-002: Pruebas de Integración - Autenticación', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const testUser = {
    email: 'admin.test@elegantcut.com',
    password: 'Password123!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Se utiliza el modelo en español 'usuarios'
    await prisma.usuarios.deleteMany({
      where: { email: testUser.email },
    });

    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    // Ajusta el nombre del campo si en tu schema.prisma no es 'password' (ej. contrasena, clave)
    await prisma.usuarios.create({
      data: {
        email: testUser.email,
        password: hashedPassword,
      },
    });
  });

  afterAll(async () => {
    await prisma.usuarios.deleteMany({
      where: { email: testUser.email },
    });
    await app.close();
  });

  it('CP-AUTH-01: Debería autenticar exitosamente y retornar access_token (200 OK)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
  });

  it('CP-AUTH-02: Debería denegar acceso con contraseña errónea (401 Unauthorized)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'ClaveIncorrecta123!',
      })
      .expect(401);
  });

  it('CP-AUTH-03: Debería denegar acceso con usuario inexistente (401/404)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'inexistente@elegantcut.com',
        password: testUser.password,
      })
      .expect(401);
  });

  it('CP-AUTH-04: Debería fallar por validación si el email es inválido (400 Bad Request)', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'formato-invalido',
        password: testUser.password,
      })
      .expect(400);
  });
});