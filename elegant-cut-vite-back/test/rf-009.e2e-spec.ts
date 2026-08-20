import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('RF-009: Crear PQRS (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let httpServer: any;
  
  let clienteId: number;
  let tokenCliente: string;

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
    jwtService = app.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    // Limpieza
    await prisma.pqrs.deleteMany();
    await prisma.detalle_cita_servicio.deleteMany();
    await prisma.reservas.deleteMany();
    await prisma.usuarios.deleteMany();
    
    // Configuración Base
    await prisma.rol.upsert({ where: { id_rol: 2 }, update: {}, create: { id_rol: 2, nombre_rol: 'Cliente' } });

    // Cliente
    const cliente = await prisma.usuarios.create({
      data: { username: 'cliente_rf009', email: 'cli@rf009.com', telefono: '123', password_hash: 'hash', prim_nombre: 'El', apellido1: 'Cliente', id_rol: 2 }
    });
    clienteId = cliente.id_usuario;

    // Tokens
    tokenCliente = jwtService.sign({ id: clienteId, id_usuario: clienteId, email: cliente.email, id_rol: 2 });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Cliente autenticado crea PQRS exitosamente (Status 201)', async () => {
    const payload = {
      id_usuario: clienteId,
      tipo_solicitud: 'Queja',
      nombre_completo: 'El Cliente Quejumbroso',
      email: 'cli@rf009.com',
      asunto: 'Servicio lento',
      descripcion: 'Me hicieron esperar 40 minutos extra'
    };

    const response = await request(httpServer)
      .post('/pqrs')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    
    // Verificamos que el radicado tenga la estructura correcta: PQRS-{ID}-{AÑO}
    const anioActual = new Date().getFullYear();
    expect(response.body.radicado).toMatch(new RegExp(`^PQRS-\\d+-${anioActual}$`));

    // Verificamos en DB que quedó como "Pendiente"
    const pqrsGuardada = await prisma.pqrs.findFirst({ where: { id_usuario: clienteId } });
    expect(pqrsGuardada!.estado).toBe('Pendiente');
  });

  it('2. Regla de Negocio: La PQRS se fuerza a Pendiente aunque el atacante envíe estado "Resuelto" (Status 201)', async () => {
    const payload = {
      id_usuario: clienteId,
      tipo_solicitud: 'Sugerencia',
      nombre_completo: 'Hacker',
      email: 'hacker@rf009.com',
      asunto: 'Quiero cambiar el estado',
      descripcion: 'Intento inyectar estado Resuelto',
      estado: 'Resuelto' // INTENTO DE INYECCIÓN
    };

    const response = await request(httpServer)
      .post('/pqrs')
      .set('Authorization', `Bearer ${tokenCliente}`)
      .send(payload);

    expect(response.status).toBe(201);

    // Verificamos en DB que NO se inyectó el estado, debe ser "Pendiente" OBLIGATORIAMENTE
    const pqrsGuardada = await prisma.pqrs.findFirst({ where: { asunto: 'Quiero cambiar el estado' } });
    expect(pqrsGuardada!.estado).toBe('Pendiente');
  });

  it('3. Seguridad: Rechazar creación de PQRS si no hay token de autenticación (Status 401)', async () => {
    const payload = {
      id_usuario: clienteId,
      tipo_solicitud: 'Peticion',
      nombre_completo: 'Fantasma',
      email: 'fantasma@rf009.com',
      asunto: 'Sin token',
      descripcion: 'Quiero crear PQRS sin loguearme'
    };

    const response = await request(httpServer)
      .post('/pqrs')
      // No enviamos header Authorization
      .send(payload);

    expect(response.status).toBe(401); // Unauthorized
  });
});
