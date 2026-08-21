import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { EmailService } from '../../src/modules/email/email.service';
import * as nodemailer from 'nodemailer';

// Mockeamos nodemailer
jest.mock('nodemailer');

describe('RF-015: Notificaciones por Email y Colas (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let emailService: EmailService;
  
  let sendMailMock: jest.Mock;

  beforeAll(async () => {
    // Configuración del mock de Nodemailer
    sendMailMock = jest.fn().mockResolvedValue(true);
    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    // Simulamos variables de entorno para nodemailer
    process.env.EMAIL_USER = 'test@example.com';
    process.env.EMAIL_PASS = '1234';

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

    prisma = app.get<PrismaService>(PrismaService);
    emailService = app.get<EmailService>(EmailService);
  });

  beforeEach(async () => {
    // Limpieza
    await prisma.cola_correos.deleteMany();
    sendMailMock.mockClear();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('1. Encolar correo asíncronamente: Guarda el correo como "Pendiente" (Status 200/201 en contexto real)', async () => {
    // Act: Simulamos el envío de una confirmación (que llama a enqueueEmail)
    const result = await emailService.sendPqrsConfirmation(
      'usuario@test.com',
      'Juan',
      'PQRS-1-2026',
      'queja'
    );

    // Assert: Debe retornar true inmediatamente y no bloquearse
    expect(result).toBe(true);

    // Validamos que se creó en la cola
    const cola = await prisma.cola_correos.findMany();
    expect(cola.length).toBe(1);
    expect(cola[0].destinatario).toBe('usuario@test.com');
    expect(cola[0].estado).toBe('Pendiente');
    expect(cola[0].intentos).toBe(0);
  });

  it('2. Procesamiento Exitoso: El Cron extrae los Pendientes, llama al Mock de Nodemailer y los marca "Enviado"', async () => {
    // Arrange: Insertamos un pendiente manualmente
    await prisma.cola_correos.create({
      data: {
        destinatario: 'exito@test.com',
        asunto: 'Prueba',
        cuerpo_html: '<p>Test</p>',
        estado: 'Pendiente'
      }
    });

    sendMailMock.mockResolvedValueOnce(true); // Simulamos que Nodemailer responde Ok

    // Act: Forzamos la ejecución de la tarea del Cron
    await emailService.processEmailQueue();

    // Assert: Nodemailer debió ser llamado
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const mockArgs = sendMailMock.mock.calls[0][0];
    expect(mockArgs.to).toBe('exito@test.com');

    // Validamos en la Base de Datos
    const procesado = await prisma.cola_correos.findFirst();
    expect(procesado!.estado).toBe('Enviado');
    expect(procesado!.intentos).toBe(1); // Sumó 1 intento
    expect(procesado!.error_ultimo).toBeNull();
  });

  it('3. Servidor Inaccesible (Cola de Reintentos): Si Nodemailer falla, marca el correo como "Fallido" para reintentar luego', async () => {
    // Arrange: Insertamos un pendiente manualmente
    await prisma.cola_correos.create({
      data: {
        destinatario: 'fallo@test.com',
        asunto: 'Prueba Falla',
        cuerpo_html: '<p>Test Falla</p>',
        estado: 'Pendiente'
      }
    });

    // Simulamos que el servidor SMTP se cayó o las credenciales son inválidas
    sendMailMock.mockRejectedValueOnce(new Error('SMTP Connection Timeout'));

    // Act
    await emailService.processEmailQueue();

    // Assert: Nodemailer debió ser llamado e intentar enviarlo
    expect(sendMailMock).toHaveBeenCalledTimes(1);

    // Validamos en la Base de Datos que NO se eliminó, sino que cambió a Fallido
    const procesado = await prisma.cola_correos.findFirst();
    expect(procesado!.estado).toBe('Fallido');
    expect(procesado!.intentos).toBe(1);
    expect(procesado!.error_ultimo).toBe('SMTP Connection Timeout');
  });
});
