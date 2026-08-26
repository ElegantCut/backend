import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('G-005: Gestión de Servicios - RF-028 Actualizar Precios y Duraciones (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let httpServer: any;
  let adminToken: string;
  let clientToken: string;
  let servicioId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    // Habilitar ValidationPipe para que los decoradores del DTO funcionen
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
    // 1. Limpieza de BD
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

    // 3. Crear Admin y Cliente
    const hashedPass = await bcrypt.hash('Password123!', 10);
    const admin = await prisma.usuarios.create({
      data: {
        username: 'adminrf028',
        email: 'adminrf028@test.com',
        prim_nombre: 'Admin',
        apellido1: 'RF028',
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
        username: 'clienterf028',
        email: 'clienterf028@test.com',
        prim_nombre: 'Cliente',
        apellido1: 'RF028',
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

    // 4. Crear un Servicio base para modificar
    const genero = await prisma.genero_servicio.create({ data: { nombre: 'Mixto' } });
    const categoria = await prisma.categorias.create({ data: { nombre: 'Tratamientos', id_genero: genero.id_genero } });

    const servicio = await prisma.servicios.create({
      data: {
        nombre: 'Limpieza Facial',
        precio: 20000,
        duracion: 30,
        id_categoria: categoria.id_categoria,
      } as any,
    });
    
    servicioId = servicio.id_servicio;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Admin debe poder actualizar precio y duración (Status 200)', async () => {
    const payload = {
      precio: 25000,
      duracion: 45,
    };

    const response = await request(httpServer)
      .patch(`/services/${servicioId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(200);

    // Validar en base de datos
    const servicioActualizado = await prisma.servicios.findUnique({ where: { id_servicio: servicioId } });
    expect(Number(servicioActualizado?.precio)).toBe(25000);
    expect(servicioActualizado?.duracion).toBe(45);
  });

  it('2. RN-005 (Precio Positivo): Debe rechazar la actualización si el nuevo precio es cero (Status 400)', async () => {
    const payload = {
      precio: 0,
    };

    const response = await request(httpServer)
      .patch(`/services/${servicioId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('positivo')])
    );
  });

  it('3. RN-005 (Precio Positivo): Debe rechazar la actualización si el nuevo precio es negativo (Status 400)', async () => {
    const payload = {
      precio: -5000,
      duracion: 60,
    };

    const response = await request(httpServer)
      .patch(`/services/${servicioId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(400);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining('positivo')])
    );
  });

  it('4. Seguridad: Cliente no puede modificar servicios (Status 403 Forbidden)', async () => {
    const payload = {
      precio: 10000, // Precio regalado
    };

    const response = await request(httpServer)
      .patch(`/services/${servicioId}`)
      .set('Authorization', `Bearer ${clientToken}`) // Token de Cliente
      .send(payload);

    expect(response.status).toBe(403);
  });
});
