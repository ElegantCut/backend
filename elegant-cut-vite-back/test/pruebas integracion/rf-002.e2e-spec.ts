import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('RF-002: Recuperación de Contraseña (e2e)', () => {
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
    // LIMPIEZA DE BD (Orden de eliminación inverso a las dependencias)
    await prisma.codigos_verificacion.deleteMany();
    await prisma.usuarios.deleteMany();
    
    // SETUP: Asegurarnos de que existe el Rol 1
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

  // Usuario genérico para usar en las pruebas
  const testUser = {
    username: 'recuperaUser',
    email: 'recupera@test.com',
    telefono: '3001234567',
    prim_nombre: 'Recu',
    apellido1: 'Pera',
    id_rol: 1,
    estado: true,
  };

  it('1. Camino Feliz: Solicitar código y cambiar contraseña exitosamente (Status 200/201)', async () => {
    // ARRANGE: Crear el usuario en la BD con una contraseña vieja
    const oldPassword = 'PasswordAntigua123!';
    const hashedOld = await bcrypt.hash(oldPassword, 10);
    
    await prisma.usuarios.create({
      data: { ...testUser, password_hash: hashedOld } as any,
    });

    // ACT 1: Pedir recuperación de contraseña (enviar email)
    const forgotResponse = await request(httpServer)
      .post('/auth/forgot-password')
      .send({ email: testUser.email });

    expect([200, 201]).toContain(forgotResponse.status);

    // ASSERT INTERMEDIO: Buscar que el código realmente se haya creado en MySQL
    const codigoInDb = await prisma.codigos_verificacion.findFirst({
      where: { email: testUser.email, tipo: 'recuperacion' },
      orderBy: { creado_en: 'desc' } // Traer el más reciente
    });
    
    expect(codigoInDb).toBeDefined();
    
    // ACT 2: Usar el código extraído de la BD para resetear la contraseña
    const newPassword = 'PasswordNueva456!';
    const resetResponse = await request(httpServer)
      .put('/auth/reset-password')
      .send({
        email: testUser.email,
        codigo: codigoInDb!.codigo, // Simulamos que leímos el código del correo
        newPassword: newPassword
      });

    expect([200, 201]).toContain(resetResponse.status);

    // ASSERT FINAL: Verificar que la contraseña realmente cambió en la BD
    const updatedUser = await prisma.usuarios.findFirst({
      where: { email: testUser.email }
    });
    
    // Validamos que la nueva contraseña coincida con el hash de la base de datos
    const isNewPassword = await bcrypt.compare(newPassword, updatedUser!.password_hash!);
    expect(isNewPassword).toBe(true);
  });

  it('2. Regla de Negocio: Debe fallar si el código de 6 dígitos no coincide (Status 400)', async () => {
    await prisma.usuarios.create({
      data: { ...testUser, password_hash: 'hashcualquiera' } as any,
    });

    // Insertar un código válido en BD
    await prisma.codigos_verificacion.create({
      data: {
        email: testUser.email,
        codigo: '123456',
        tipo: 'recuperacion',
      }
    });

    // Intentar usar un código incorrecto
    const resetResponse = await request(httpServer)
      .put('/auth/reset-password')
      .send({
        email: testUser.email,
        codigo: '999999', // Código inventado incorrecto
        newPassword: 'NuevaPassword123!'
      });

    // El servidor debe rechazar la solicitud
    expect([400, 401]).toContain(resetResponse.status);
  });

  it('3. Regla de Negocio: Debe fallar si el código expiró pasados los 15 min (Status 400)', async () => {
    await prisma.usuarios.create({
      data: { ...testUser, password_hash: 'hashcualquiera' } as any,
    });

    // Crear un código manualmente que expiró hace 16 minutos
    const fechaExpirada = new Date(Date.now() - 16 * 60 * 1000); 
    
    await prisma.codigos_verificacion.create({
      data: {
        email: testUser.email,
        codigo: '654321',
        tipo: 'recuperacion',
        expira_en: fechaExpirada, // Ya venció
      }
    });

    const resetResponse = await request(httpServer)
      .put('/auth/reset-password')
      .send({
        email: testUser.email,
        codigo: '654321',
        newPassword: 'NuevaPassword123!'
      });

    // El servidor debe rechazarlo por código expirado
    expect([400, 401]).toContain(resetResponse.status);
  });
  
  it('4. Validación DTO: Debe fallar si mandamos un código que no es numérico o no tiene 6 dígitos (Status 400)', async () => {
    const resetResponse = await request(httpServer)
      .put('/auth/reset-password')
      .send({
        email: 'cualquier@test.com',
        codigo: 'ABC', // Totalmente inválido
        newPassword: 'NuevaPassword123!'
      });

    expect(resetResponse.status).toBe(400);
  });
});
