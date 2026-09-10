import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('G-003: Gestión de Barberos - RF-023 Portafolios (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;
  let barberoId: number;

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

    // 2. Insertar Rol de Barbero
    await prisma.rol.upsert({ where: { id_rol: 3 }, update: {}, create: { id_rol: 3, nombre_rol: 'Barbero' } });

    // 3. Crear un Barbero en la tabla usuarios para asignarle el portafolio
    const barbero = await prisma.usuarios.create({
      data: {
        username: 'barbero_rf023',
        email: 'barberorf023@test.com',
        prim_nombre: 'Barbero',
        apellido1: 'Test',
        password_hash: 'hashcualquiera',
        id_rol: 3,
        estado: true,
      } as any,
    });
    barberoId = barbero.id_usuario;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Debe permitir crear portafolio si contiene imágenes (Status 201)', async () => {
    const validPayload = {
      id_usuario: barberoId,
      biografia: 'Soy un barbero experto con más de 10 años de experiencia.',
      experiencia: '10 años',
      especialidades: ['Fade', 'Clásico'],
      instagram: '@barbero_pro',
      fotos_portafolio: ['https://url.com/foto1.jpg', 'https://url.com/foto2.jpg'],
    };

    const response = await request(httpServer)
      .post('/portabarbero')
      .send(validPayload);

    // Como el endpoint está marcado con @Public() temporalmente, no enviamos Token
    expect([200, 201]).toContain(response.status);

    // Verificamos que se haya guardado en la BD
    const portafolioDb = await prisma.portafolios.findFirst({
      where: { id_usuario: barberoId },
    });
    
    expect(portafolioDb).toBeDefined();
    expect(portafolioDb?.biografia).toBe(validPayload.biografia);
  });

  it('2. RN-003: Debe rechazar la creación si el arreglo de fotos está vacío (Status 400)', async () => {
    const invalidPayload = {
      id_usuario: barberoId,
      biografia: 'Esta bio es genial, pero no subo fotos.',
      fotos_portafolio: [], // Arreglo vacío (viola RN-003)
    };

    const response = await request(httpServer)
      .post('/portabarbero')
      .send(invalidPayload);

    // Debe ser rechazado por regla de negocio
    expect(response.status).toBe(400);
  });

  it('3. RN-003: Debe rechazar la creación si el campo de fotos no se envía (Status 400)', async () => {
    const invalidPayload = {
      id_usuario: barberoId,
      biografia: 'No envío el campo fotos_portafolio en absoluto.',
      // fotos_portafolio omitido (viola RN-003)
    };

    const response = await request(httpServer)
      .post('/portabarbero')
      .send(invalidPayload);

    // Debe ser rechazado
    expect(response.status).toBe(400);
  });
});
