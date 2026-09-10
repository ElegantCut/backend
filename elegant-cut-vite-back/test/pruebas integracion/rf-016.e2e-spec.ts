import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('RF-016: Consulta de Estado de PQRS (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let httpServer: any;
  
  let clienteId: number;
  let pqrsId: number;
  let radicadoValido: string;

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
    // Limpieza
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
    
    // Configuración Base
    await prisma.rol.upsert({ where: { id_rol: 2 }, update: {}, create: { id_rol: 2, nombre_rol: 'Cliente' } });

    // Cliente
    const cliente = await prisma.usuarios.create({
      data: { username: 'cli_rf016', email: 'cli@rf016.com', telefono: '123', password_hash: 'hash', prim_nombre: 'El', apellido1: 'Cliente', id_rol: 2 }
    });
    clienteId = cliente.id_usuario;

    // Crear una PQRS de prueba
    const pqrs = await prisma.pqrs.create({
      data: {
        id_usuario: clienteId,
        tipo: 'Reclamo',
        asunto: 'Silla rota',
        descripcion: 'La silla estaba rota',
        estado: 'En_Proceso' // Estado para comprobar
      }
    });
    pqrsId = pqrs.id_pqrs;
    const anioActual = new Date().getFullYear();
    radicadoValido = `PQRS-${pqrsId}-${anioActual}`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Consulta exitosa de estado de PQRS existente (Status 200)', async () => {
    const response = await request(httpServer)
      .get(`/pqrs/status/${radicadoValido}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    
    // Validamos que devuelva el estado "En_Proceso" que seteamos
    expect(response.body.data).toBeDefined();
    expect(response.body.data.estado).toBe('En_Proceso');
  });

  it('2. Regla de Negocio: Retornar 404 si el radicado no existe en la base de datos', async () => {
    const anioActual = new Date().getFullYear();
    const radicadoInexistente = `PQRS-999999-${anioActual}`;

    const response = await request(httpServer)
      .get(`/pqrs/status/${radicadoInexistente}`);

    // El requerimiento dice explícitamente: "Si el radicado no existe, debe retornar un error 404"
    expect(response.status).toBe(404);
  });

  it('3. Regla de Negocio: Retornar 404 si el formato del radicado es inválido', async () => {
    const radicadoInvalido = `HOLA-123`;

    const response = await request(httpServer)
      .get(`/pqrs/status/${radicadoInvalido}`);

    expect(response.status).toBe(404);
  });
});
