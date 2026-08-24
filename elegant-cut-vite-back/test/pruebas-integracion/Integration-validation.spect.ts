import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';


describe('Pruebas Integradas del Sistema', () => {
  let app: INestApplication;
  let authToken: string;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();


    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });


  afterAll(async () => {
    await app.close();
  });

  // 1. MÓDULO: SEGURIDAD (G-002)

  describe('Módulo: Seguridad', () => {
    it('G-002: Debe validar credenciales y realizar login exitoso', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin',
          password: '12345678',
        })
        .expect(201);


      expect(response.body).toHaveProperty('accessToken');
      authToken = response.body.accessToken;
    });


    it('G-002: Debe denegar el acceso si la contraseña es incorrecta', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'admin@barberia.com',
          password: 'clave_incorrecta',
        })
        .expect(401);
    });
  });


  // 2. MÓDULO: RECURSOS HUMANOS (G-003)

  describe('Módulo: Recursos Humanos', () => {
    let barberId: string;


    it('RF-017 / RF-023: Debe registrar un nuevo barbero', async () => {
      const response = await request(app.getHttpServer())
        .post('/barbers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Carlos Pérez',
          phone: '3001234567',
          bio: 'Barbero especialista en cortes urbanos.',
        })
        .expect(201);


      expect(response.body).toHaveProperty('id');
      barberId = response.body.id;
    });


    it('RF-024: Debe consultar la lista completa de barberos', async () => {
      const response = await request(app.getHttpServer())
        .get('/barbers')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);


      expect(Array.isArray(response.body)).toBe(true);
    });


    it('RF-025: Debe actualizar la información del barbero', async () => {
      await request(app.getHttpServer())
        .patch(`/barbers/${barberId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Carlos Pérez Actualizado' })
        .expect(200);
    });
  });


  // 3. MÓDULO: CATÁLOGO (G-005)
  describe('Módulo: Catálogo', () => {
    let serviceId: string;


    it('RF-026 / RF-027: Debe crear un nuevo servicio', async () => {
      const response = await request(app.getHttpServer())
        .post('/services')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Corte Tradicional',
          price: 20000,
          durationMin: 30,
        })
        .expect(201);


      expect(response.body).toHaveProperty('id');
      serviceId = response.body.id;
    });


    it('RF-028: Debe modificar el precio o parámetros del servicio', async () => {
      await request(app.getHttpServer())
        .patch(`/services/${serviceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ price: 25000 })
        .expect(200);
    });


    it('RF-029: Debe desactivar o eliminar un servicio del catálogo', async () => {
      await request(app.getHttpServer())
        .delete(`/services/${serviceId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  // 4. MÓDULO: ADMINISTRACIÓN (G-007)
  describe('Módulo: Administración', () => {
    it('G-007: Debe obtener las métricas del dashboard administrativo', async () => {
      await request(app.getHttpServer())
        .get('/admin/metrics')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });


    it('G-007: Debe generar el reporte consolidado por fechas', async () => {
      await request(app.getHttpServer())
        .get('/admin/reports?startDate=2026-07-01&endDate=2026-07-31')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });
});

