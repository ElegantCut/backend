import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('RF-014: Perfil de Usuario (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let httpServer: any;
  let userToken: string;
  let userId: number;

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
    // 1. Limpieza de BD
    await prisma.reservas.deleteMany();
    await prisma.usuarios.deleteMany();
    await prisma.rol.upsert({
      where: { id_rol: 2 },
      update: {},
      create: { id_rol: 2, nombre_rol: 'Cliente' },
    });

    // 2. Crear un usuario de prueba válido
    const hashed = await bcrypt.hash('Password123!', 10);
    const user = await prisma.usuarios.create({
      data: {
        username: 'juan.cliente',
        email: 'juan@cliente.com',
        telefono: '3001234567',
        password_hash: hashed,
        prim_nombre: 'Juan',
        apellido1: 'Cliente',
        id_rol: 2,
        estado: true
      }
    });
    userId = user.id_usuario;

    // 3. Generar token JWT válido (simulando que el usuario hizo Login)
    userToken = jwtService.sign({
      id: user.id_usuario,
      id_usuario: user.id_usuario,
      email: user.email,
      role: 'cliente',
      id_rol: user.id_rol
    });

    // 4. Crear una cita falsa para poder probar el historial
    await prisma.reservas.create({
      data: {
        id_usuario: userId,
        fecha: new Date(),
        observaciones: 'Corte de prueba historial'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Camino Feliz: Consultar mi perfil (GET /users/me) (Status 200)', async () => {
    const response = await request(httpServer)
      .get('/users/me')
      .set('Authorization', `Bearer ${userToken}`); // ¡Obligatorio enviar el Token!

    expect(response.status).toBe(200);
    expect(response.body.email).toBe('juan@cliente.com');
    expect(response.body.prim_nombre).toBe('Juan');
    
    // REGLA DE NEGOCIO Y SEGURIDAD: Nunca devolver el hash de la contraseña al frontend
    expect(response.body.password_hash).toBeUndefined(); 
  });

  it('2. Camino Feliz: Actualizar datos de mi perfil (PATCH /users/profile) (Status 200)', async () => {
    const response = await request(httpServer)
      .patch('/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ telefono: '3219876543' }); // Cambiamos el teléfono

    expect(response.status).toBe(200);

    // Validamos que el teléfono haya cambiado en MySQL
    const userInDb = await prisma.usuarios.findFirst({ where: { id_usuario: userId } });
    expect(userInDb!.telefono).toBe('3219876543');
  });

  it('3. Regla de Negocio: Evitar escalamiento de privilegios al actualizar perfil (Status 400 o ignorar)', async () => {
    // Un hacker intercepta la petición e intenta inyectar "id_rol: 1" (Admin)
    const response = await request(httpServer)
      .patch('/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ telefono: '1111111111', id_rol: 1 });

    // Comportamiento esperado: O el ValidationPipe rechaza la petición con un 400,
    // o el controlador la acepta (200) pero IGNORA silenciosamente el id_rol.
    
    // Verificamos en la Base de Datos que el rol SIGUE SIENDO Cliente (2)
    const userInDb = await prisma.usuarios.findFirst({ where: { id_usuario: userId } });
    expect(userInDb!.id_rol).toBe(2); // ¡No debe haber escalado a 1!
  });

  it('4. Camino Feliz: Consultar historial de citas (GET /appointments/user/:id) (Status 200)', async () => {
    const response = await request(httpServer)
      .get(`/appointments/user/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    // La API devuelve { success: true, data: [...] }
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
    expect(response.body.data[0].observaciones).toBe('Corte de prueba historial');
  });
});
