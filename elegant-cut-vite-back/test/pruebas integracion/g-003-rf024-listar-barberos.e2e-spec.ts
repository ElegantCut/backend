import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('G-003: Gestión de Barberos - RF-024 Listar Barberos (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
    prisma = app.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // Limpieza de DB
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

    await prisma.rol.upsert({ where: { id_rol: 3 }, update: {}, create: { id_rol: 3, nombre_rol: 'Barbero' } });

    // Insertar 3 Barberos de prueba
    // Barbero 1: Activo con Portafolio (Especialidad: Fade)
    const b1 = await prisma.usuarios.create({
      data: {
        username: 'barbero_activo_1',
        email: 'activo1@test.com',
        prim_nombre: 'Andres',
        apellido1: 'Activo',
        id_rol: 3,
        estado: true, // ACTIVO
      } as any,
    });
    await prisma.portafolios.create({
      data: {
        id_usuario: b1.id_usuario,
        especialidades: JSON.stringify(['Fade', 'Clásico']),
        fotos_portafolio: JSON.stringify(['foto1.jpg']),
      } as any,
    });

    // Barbero 2: Activo con Portafolio (Especialidad: Color)
    const b2 = await prisma.usuarios.create({
      data: {
        username: 'barbero_activo_2',
        email: 'activo2@test.com',
        prim_nombre: 'Carlos',
        apellido1: 'Activo',
        id_rol: 3,
        estado: true, // ACTIVO
      } as any,
    });
    await prisma.portafolios.create({
      data: {
        id_usuario: b2.id_usuario,
        especialidades: JSON.stringify(['Colorimetría', 'Barba']),
        fotos_portafolio: JSON.stringify(['foto2.jpg']),
      } as any,
    });

    // Barbero 3: Inactivo (NO debería listarse en el endpoint público)
    const b3 = await prisma.usuarios.create({
      data: {
        username: 'barbero_inactivo_1',
        email: 'inactivo1@test.com',
        prim_nombre: 'Pedro',
        apellido1: 'Inactivo',
        id_rol: 3,
        estado: false, // INACTIVO
      } as any,
    });
    await prisma.portafolios.create({
      data: {
        id_usuario: b3.id_usuario,
        especialidades: JSON.stringify(['Clásico']),
        fotos_portafolio: JSON.stringify(['foto3.jpg']),
      } as any,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Debe retornar lista de barberos ACTIVOS junto con sus portafolios (Status 200)', async () => {
    const response = await request(httpServer).get('/barbers/public');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // Debe retornar exactamente 2 barberos (solo los activos)
    expect(response.body.length).toBe(2);

    // Validamos que incluyan la propiedad portafolios
    const firstBarber = response.body[0];
    expect(firstBarber).toHaveProperty('portafolios');
    expect(firstBarber.portafolios).not.toBeNull();
  });

  it('2. Regla de Negocio: No debe retornar barberos inactivos en el endpoint público', async () => {
    const response = await request(httpServer).get('/barbers/public');

    // Revisamos que ningún barbero devuelto tenga estado falso o sea Pedro Inactivo
    const inactivos = response.body.filter((b: any) => b.estado === false || b.username === 'barbero_inactivo_1');
    expect(inactivos.length).toBe(0);
  });

  it('3. Filtros opcionales (Bug Anticipado): Debe permitir filtrar por especialidad', async () => {
    // Si enviamos el query param ?especialidad=Fade, solo debería retornar a Andres
    const response = await request(httpServer).get('/barbers/public?especialidad=Fade');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Como solo 1 barbero tiene "Fade", el arreglo debe tener longitud 1
    // Si el backend no soporta filtros, devolverá 2 y este test fallará
    expect(response.body.length).toBe(1);
    expect(response.body[0].username).toBe('barbero_activo_1');
  });
});
