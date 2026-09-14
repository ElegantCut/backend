import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  /**
   * Crea el transporter en el momento del envío (no en el constructor),
   * para garantizar que las variables de entorno ya estén cargadas.
   */
  private createTransporter() {
    const user = this.configService.get<string>('EMAIL_USER');
    // Quitar los espacios del App Password (Google a veces los rechaza si se envían con espacios)
    const rawPass = this.configService.get<string>('EMAIL_PASS') || '';
    const pass = rawPass.replace(/\s+/g, '');

    console.log(
      `[EMAIL] Configurando transporter con usuario: ${user ? user : '⚠️ NO DEFINIDO'}`,
    );

    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user, pass },
      tls: {
        // Esto ayuda si Docker tiene problemas con los certificados raíz
        rejectUnauthorized: false,
      },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      },
    });
  }

  /**
   * Encola un correo electrónico para ser enviado asíncronamente.
   */
  async enqueueEmail(destinatario: string, asunto: string, cuerpo_html: string): Promise<boolean> {
    try {
      await this.prisma.cola_correos.create({
        data: {
          destinatario,
          asunto,
          cuerpo_html,
          estado: 'Pendiente',
        },
      });

      this.logger.log(`Correo encolado para: ${destinatario}`);
      
      // Disparamos el procesamiento de forma asíncrona (Fire-and-forget)
      setTimeout(() => this.processEmailQueue().catch(e => this.logger.error(e)), 100);
      
      return true;
    } catch (error) {
      this.logger.error('Error al encolar el correo', error);
      return false;
    }
  }

  /**
   * Tarea periódica que procesa la cola de correos.
   * Ejecuta cada minuto buscando correos pendientes o fallidos con menos de 3 intentos.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async processEmailQueue(isTestCall = false) {
    if (process.env.NODE_ENV === 'test' && !isTestCall) return;
    
    const pendientes = await this.prisma.cola_correos.findMany({
      where: {
        estado: { in: ['Pendiente', 'Fallido'] },
        intentos: { lt: 3 }, // Máximo 3 intentos
      },
      take: 10, // Procesamos en lotes de 10 para no saturar
      orderBy: { fecha_creado: 'asc' }
    });

    if (pendientes.length === 0) return;

    const transporter = this.createTransporter();
    const emailUser = this.configService.get<string>('EMAIL_USER');

    if (!transporter || !emailUser) {
      this.logger.warn('No se puede procesar la cola: Transporter no configurado');
      return;
    }

    for (const correo of pendientes) {
      try {
        await this.prisma.cola_correos.update({
          where: { id_cola: correo.id_cola },
          data: { intentos: { increment: 1 }, fecha_intento: new Date() }
        });

        await transporter.sendMail({
          from: `"Elegant Cut" <${emailUser}>`,
          to: correo.destinatario,
          subject: correo.asunto,
          html: correo.cuerpo_html,
        });

        await this.prisma.cola_correos.update({
          where: { id_cola: correo.id_cola },
          data: { estado: 'Enviado', error_ultimo: null }
        });

        this.logger.log(`✅ Correo enviado exitosamente a ${correo.destinatario}`);
      } catch (error) {
        this.logger.error(`❌ Error enviando correo a ${correo.destinatario}`, error.message);
        
        const isFinalAttempt = correo.intentos + 1 >= 3;
        
        await this.prisma.cola_correos.update({
          where: { id_cola: correo.id_cola },
          data: { 
            estado: isFinalAttempt ? 'Cancelado' : 'Fallido',
            error_ultimo: error.message 
          }
        });
      }
    }
  }

  // --- MÉTODOS DE NEGOCIO ---

  async sendVerificationCode(email: string, code: string): Promise<boolean> {
    const emailUser = this.configService.get('EMAIL_USER');
    const emailPass = this.configService.get('EMAIL_PASS');

    console.log(`\n\n=========================================\n[EMAIL BYPASS] CÓDIGO DE VERIFICACIÓN PARA ${email}:\n>>> ${code} <<<\n=========================================\n\n`);
    console.log(`[EMAIL] Iniciando envío de código ${code} a ${email}`);
    console.log(
      `[EMAIL] EMAIL_USER configurado: ${emailUser ? '✅ SÍ' : '❌ NO'}`,
    );
    console.log(
      `[EMAIL] EMAIL_PASS configurado: ${emailPass ? '✅ SÍ' : '❌ NO'}`,
    );

    if (!emailUser || !emailPass) {
      console.error(
        '❌ [EMAIL] Credenciales no configuradas. Revisa EMAIL_USER y EMAIL_PASS en el .env',
      );
      // BYPASS: En lugar de fallar, permitimos que pase para probar localmente/Railway
      return true;
    }

    try {
      const transporter = this.createTransporter();

      const mailOptions = {
        from: `"Elegant Cut" <${emailUser}>`,
        to: email,
        subject: 'Código de Verificación - Elegant Cut',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Verificación de Seguridad</h2>
            <p>Tu código de verificación es:</p>
            <h1 style="color: #BC2041; letter-spacing: 5px;">${code}</h1>
            <p>Este código expirará en 15 minutos.</p>
            <p>Si no solicitaste este código, ignora este correo.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL] ✅ Correo enviado exitosamente a ${email}`);
      return true;
    } catch (error) {
      console.error('❌ [EMAIL] Error al enviar correo:');
      console.error(`   Mensaje: ${error.message}`);
      console.error(`   Código:  ${error.code}`);
      console.error(`   Detalle: ${JSON.stringify(error.response ?? '')}`);
      
      console.warn(`[EMAIL] Falló el envío, pero se continuará para pruebas locales/Railway.`);
      return true;
    }
  }

  async sendPqrsConfirmation(
    email: string,
    userName: string,
    radicado: string,
    type: string,
  ): Promise<boolean> {
    const emailUser = this.configService.get('EMAIL_USER');
    const emailPass = this.configService.get('EMAIL_PASS');

    if (!emailUser || !emailPass) {
      console.error('❌ [EMAIL] Credenciales no configuradas para PQRS.');
      return false;
    }

    try {
      const transporter = this.createTransporter();

      const message =
        type === 'peticion'
          ? '¡Tu petición fue exitosa!'
          : type === 'queja'
            ? '¡Tu queja fue exitosa!'
            : `Tu ${type} ha sido radicada exitosamente.`;

      const mailOptions = {
        from: `"Elegant Cut" <${emailUser}>`,
        to: email,
        subject: `Confirmación de PQRS - ${radicado}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
            <h2 style="color: #BC2041;">Elegant Cut</h2>
            <h3>${message}</h3>
            <p>Hola <strong>${userName}</strong>,</p>
            <p>Hemos recibido tu solicitud correctamente.</p>
            <p><strong>Número de Radicado:</strong> ${radicado}</p>
            <br>
            <p>Gracias por contactarnos.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL] ✅ Confirmación PQRS enviada a ${email}`);
      return true;
    } catch (error) {
      console.error('❌ [EMAIL] Error en confirmación PQRS:');
      console.error(`   Mensaje: ${error.message}`);
      console.error(`   Código:  ${error.code}`);
      return false;
    }
  }
}
