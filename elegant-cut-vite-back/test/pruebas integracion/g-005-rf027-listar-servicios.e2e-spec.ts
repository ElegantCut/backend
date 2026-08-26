import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('G-005: Gestión de Servicios - RF-027 Listar y Categorizar Servicios (e2e)', () => {
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
    // 1. Limpieza de base de datos
    await prisma.detalle_cita_servicio.deleteMany();
    await prisma.reservas.deleteMany();
    await prisma.barberos_servicios.deleteMany();
    await prisma.servicios.deleteMany();
    await prisma.categorias.deleteMany();
    await prisma.genero_servicio.deleteMany();

    // 2. Crear Géneros
    const generoCaballero = await prisma.genero_servicio.create({ data: { id_genero: 1, nombre: 'Caballero' } as any });
    const generoDama = await prisma.genero_servicio.create({ data: { id_genero: 2, nombre: 'Dama' } as any });

    // 3. Crear Categorías
    const catBarba = await prisma.categorias.create({ data: { nombre: 'Barba', id_genero: generoCaballero.id_genero } as any });
    const catCabelloDama = await prisma.categorias.create({ data: { nombre: 'Cortes Dama', id_genero: generoDama.id_genero } as any });

    // 4. Crear Servicios asociados
    await prisma.servicios.create({
      data: {
        nombre: 'Arreglo de Barba Tradicional',
        precio: 15000,
        duracion: 20,
        id_categoria: catBarba.id_categoria,
      } as any,
    });

    await prisma.servicios.create({
      data: {
        nombre: 'Corte Bob Dama',
        precio: 35000,
        duracion: 45,
        id_categoria: catCabelloDama.id_categoria,
      } as any,
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Debe listar los servicios correctamente filtrados para Caballero (Status 200)', async () => {
    const response = await request(httpServer).get('/services/gender/1');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Solo creamos 1 servicio de caballero
    expect(response.body.length).toBe(1);
    expect(response.body[0].nombre).toBe('Arreglo de Barba Tradicional');
    
    // Validamos que el servicio traiga la información de su categoría anidada
    expect(response.body[0].categorias).toBeDefined();
    expect(response.body[0].categorias.id_genero).toBe(1);
  });

  it('2. Camino Feliz: Debe listar los servicios correctamente filtrados para Dama (Status 200)', async () => {
    const response = await request(httpServer).get('/services/gender/2');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // Solo creamos 1 servicio de dama
    expect(response.body.length).toBe(1);
    expect(response.body[0].nombre).toBe('Corte Bob Dama');
    expect(response.body[0].categorias.id_genero).toBe(2);
  });

  it('3. Regla de Negocio: Si se solicita un género que no existe, debe retornar un arreglo vacío', async () => {
    const response = await request(httpServer).get('/services/gender/999');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('4. Validación de Entradas: Debe rechazar la consulta si el parámetro no es un número (ParseIntPipe)', async () => {
    const response = await request(httpServer).get('/services/gender/Caballero');
    // El Pipe rechaza con 400 Bad Request por intentar pasar "Caballero" en lugar de un Int (1 o 2)
    expect(response.status).toBe(400);
  });
});
