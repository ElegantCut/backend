import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('G-005: Gestión de Servicios - RF-026 Crear Servicio (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let httpServer: any;
  let adminToken: string;
  let clientToken: string;
  let categoriaId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Habilitamos los pipes globales para que @IsPositive funcione y devuelva 400
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
    jwtService = app.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    // 1. Limpieza de tablas
    await prisma.detalle_cita_servicio.deleteMany();
    await prisma.reservas.deleteMany();
    await prisma.barberos_servicios.deleteMany();
    await prisma.servicios.deleteMany();
    await prisma.categorias.deleteMany();
    await prisma.genero_servicio.deleteMany();
    await prisma.usuarios.deleteMany();

    // 2. Setup Roles
    await prisma.rol.upsert({ where: { id_rol: 1 }, update: {}, create: { id_rol: 1, nombre_rol: 'Admin' } });
    await prisma.rol.upsert({ where: { id_rol: 2 }, update: {}, create: { id_rol: 2, nombre_rol: 'Cliente' } });

    // 3. Crear Admin
    const hashedPass = await bcrypt.hash('Password123!', 10);
    const admin = await prisma.usuarios.create({
      data: {
        username: 'admin_servicios',
        email: 'adminserv@test.com',
        prim_nombre: 'Admin',
        apellido1: 'Servicios',
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

    // 4. Crear Cliente
    const client = await prisma.usuarios.create({
      data: {
        username: 'cliente_servicios',
        email: 'clienteserv@test.com',
        prim_nombre: 'Client',
        apellido1: 'Servicios',
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

    // 5. Crear Género y Categoría requeridos por el servicio
    const genero = await prisma.genero_servicio.create({
      data: { nombre: 'Masculino' }
    });

    const categoria = await prisma.categorias.create({
      data: { nombre: 'Cortes Clasicos', descripcion: 'Cortes tradicionales', id_genero: genero.id_genero }
    });
    categoriaId = categoria.id_categoria;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Admin debe poder crear un servicio con datos válidos (Status 201)', async () => {
    const payload = {
      nombre: 'Corte Tradicional con Tijera',
      duracion: 40,
      precio: 25000,
      descripcion: 'Corte tradicional sin máquina',
      id_categoria: categoriaId,
    };

    const response = await request(httpServer)
      .post('/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.nombre).toBe(payload.nombre);

    // Verificar BD
    const servicioDb = await prisma.servicios.findFirst({ where: { nombre: payload.nombre } });
    expect(servicioDb).toBeDefined();
    expect(Number(servicioDb?.precio)).toBe(25000); // El precio en BD puede ser Decimal
  });

  it('2. RN-005 (Precio Positivo): Debe rechazar la creación si el precio es cero (Status 400)', async () => {
    const payload = {
      nombre: 'Corte Gratis',
      duracion: 40,
      precio: 0, // Precio cero
      descripcion: 'Servicio gratuito',
      id_categoria: categoriaId,
    };

    const response = await request(httpServer)
      .post('/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    // Gracias al DTO (@IsPositive), debe rechazar con 400 Bad Request
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('positivo')])
    );
  });

  it('3. RN-005 (Precio Positivo): Debe rechazar la creación si el precio es negativo (Status 400)', async () => {
    const payload = {
      nombre: 'Corte que te paga',
      duracion: 40,
      precio: -15000, // Precio negativo
      descripcion: 'Te pagamos por cortarte',
      id_categoria: categoriaId,
    };

    const response = await request(httpServer)
      .post('/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('positivo')])
    );
  });

  it('4. Seguridad: Un cliente no puede crear un servicio (Status 403)', async () => {
    const payload = {
      nombre: 'Corte Intruso',
      duracion: 30,
      precio: 10000,
      descripcion: 'Corte creado por un cliente',
      id_categoria: categoriaId,
    };

    const response = await request(httpServer)
      .post('/services')
      .set('Authorization', `Bearer ${clientToken}`) // Token cliente
      .send(payload);

    expect(response.status).toBe(403);
  });
});
