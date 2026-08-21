import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('RF-031: Reprogramar Cita (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let httpServer: any;
  
  let cliente1Id: number;
  let cliente2Id: number;
  let barberoId: number;
  let tokenCliente1: string;
  let tokenCliente2: string;
  
  let citaParaReprogramarId: number;
  let citaOcupadaId: number;
  let horarioLibreId: number;
  let horarioOcupadoId: number;

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
    await prisma.rol.upsert({ where: { id_rol: 3 }, update: {}, create: { id_rol: 3, nombre_rol: 'Barbero' } });
    await prisma.estado_cita.upsert({ where: { id_estado_cita: 1 }, update: {}, create: { id_estado_cita: 1, confirmada: false } });

    // Barbero y Clientes
    const barbero = await prisma.usuarios.create({
      data: { username: 'barbero_rf031', email: 'barb@rf031.com', telefono: '000', password_hash: 'hash', prim_nombre: 'El', apellido1: 'Barbero', id_rol: 3 }
    });
    barberoId = barbero.id_usuario;

    const cliente1 = await prisma.usuarios.create({
      data: { username: 'cliente1_rf031', email: 'c1@rf031.com', telefono: '111', password_hash: 'hash', prim_nombre: 'Cli', apellido1: 'Uno', id_rol: 2 }
    });
    cliente1Id = cliente1.id_usuario;

    const cliente2 = await prisma.usuarios.create({
      data: { username: 'cliente2_rf031', email: 'c2@rf031.com', telefono: '222', password_hash: 'hash', prim_nombre: 'Cli', apellido1: 'Dos', id_rol: 2 }
    });
    cliente2Id = cliente2.id_usuario;

    // Tokens
    tokenCliente1 = jwtService.sign({ id: cliente1Id, id_usuario: cliente1Id, email: cliente1.email, id_rol: 2 });
    tokenCliente2 = jwtService.sign({ id: cliente2Id, id_usuario: cliente2Id, email: cliente2.email, id_rol: 2 });

    // Servicio Ficticio (Duracion 30m)
    const servicio = await prisma.servicios.create({ data: { nombre: 'Corte', duracion: 30, precio: 10000 } });

    // Horarios ficticios (8:00 AM, 9:00 AM)
    const h1 = await prisma.horarios.create({ data: { hora_inicio: 800, hora_fin: 830 } });
    const h2 = await prisma.horarios.create({ data: { hora_inicio: 900, hora_fin: 930 } });
    horarioLibreId = h1.id_horarios; // Inicialmente libre para reprogramar
    horarioOcupadoId = h2.id_horarios; // Inicialmente ocupado

    // Fecha futura para pruebas
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);

    // Cita 1: Pertenece al Cliente 1, está pendiente (vamos a reprogramarla)
    const cita1 = await prisma.reservas.create({
      data: { fecha: manana, id_usuario: cliente1Id, id_empleado: barbero.id_usuario, id_estado_cita: 1, id_horarios: horarioLibreId }
    });
    await prisma.detalle_cita_servicio.create({ data: { id_reservas: cita1.id_reservas, id_servicio: servicio.id_servicio } });
    citaParaReprogramarId = cita1.id_reservas;

    // Cita 2: Pertenece al Cliente 2, ocupa el horario 2 (9:00 AM)
    const cita2 = await prisma.reservas.create({
      data: { fecha: manana, id_usuario: cliente2Id, id_empleado: barbero.id_usuario, id_estado_cita: 1, id_horarios: horarioOcupadoId }
    });
    await prisma.detalle_cita_servicio.create({ data: { id_reservas: cita2.id_reservas, id_servicio: servicio.id_servicio } });
    citaOcupadaId = cita2.id_reservas;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  const getFutureDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2); // Pasado mañana
    return d.toISOString().split('T')[0];
  };

  const getPastDate = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1); // Ayer
    return d.toISOString().split('T')[0];
  };

  it('1. Camino Feliz: Cliente reprograma cita exitosamente a fecha futura (Status 200)', async () => {
    const nuevaFecha = getFutureDate();
    const response = await request(httpServer)
      .patch(`/appointments/${citaParaReprogramarId}/reschedule`)
      .set('Authorization', `Bearer ${tokenCliente1}`)
      .send({ userId: cliente1Id, fecha: nuevaFecha, id_horarios: horarioLibreId });

    expect(response.status).toBe(200);
    
    // Verificamos en DB
    const citaActualizada = await prisma.reservas.findUnique({ where: { id_reservas: citaParaReprogramarId } });
    expect(citaActualizada!.fecha.toISOString().split('T')[0]).toBe(nuevaFecha);
  });

  it('2. Regla de Negocio: Rechazar reprogramación en una fecha pasada (Status 400)', async () => {
    const nuevaFecha = getPastDate(); // Fecha inválida (Ayer)
    const response = await request(httpServer)
      .patch(`/appointments/${citaParaReprogramarId}/reschedule`)
      .set('Authorization', `Bearer ${tokenCliente1}`)
      .send({ userId: cliente1Id, fecha: nuevaFecha, id_horarios: horarioLibreId });

    // Esperamos que el backend atrape la fecha pasada y la rechace
    expect(response.status).toBe(400);
  });

  it('3. Regla de Negocio: Rechazar reprogramación si el nuevo slot se cruza con otra cita (Status 400)', async () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const fechaManana = manana.toISOString().split('T')[0];

    // Intentar mover la cita al horario 2 (que ya está ocupado por el Cliente 2)
    const response = await request(httpServer)
      .patch(`/appointments/${citaParaReprogramarId}/reschedule`)
      .set('Authorization', `Bearer ${tokenCliente1}`)
      .send({ userId: cliente1Id, fecha: fechaManana, id_horarios: horarioOcupadoId, id_empleado: barberoId });

    // El sistema debe verificar disponibilidad y lanzar Error si está ocupado
    expect(response.status).toBe(400);
  });

  it('4. Seguridad: Cliente 2 no puede reprogramar la cita del Cliente 1 (Status 403)', async () => {
    const nuevaFecha = getFutureDate();
    const response = await request(httpServer)
      .patch(`/appointments/${citaParaReprogramarId}/reschedule`)
      .set('Authorization', `Bearer ${tokenCliente2}`) // <-- Token invasor
      .send({ userId: cliente2Id, fecha: nuevaFecha, id_horarios: horarioLibreId });

    expect(response.status).toBe(403);
  });
});
