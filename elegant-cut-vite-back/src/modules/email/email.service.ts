import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { Resend } from 'resend';
import * as dns from 'dns';

// Solución para servidores (como Railway o Docker) que intentan conectarse por IPv6 
// y fallan (ENETUNREACH). Esto fuerza a Node.js a preferir IPv4.
dns.setDefaultResultOrder('ipv4first');
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) { }

  /**
   * Crea el transporter en el momento del envío (no en el constructor),
   * para garantizar que las variables de entorno ya estén cargadas.
   */
  private async createTransporter() {
    const user = this.configService.get<string>('EMAIL_USER');
    // Quitar los espacios del App Password (Google a veces los rechaza si se envían con espacios)
    const rawPass = this.configService.get<string>('EMAIL_PASS') || '';
    const pass = rawPass.replace(/\s+/g, '');

    console.log(
      `[EMAIL] Configurando transporter con usuario: ${user ? user : '⚠️ NO DEFINIDO'}`,
    );

    // Resolución manual de IPv4 para evitar error ENETUNREACH en Railway (IPv6)
    const dns = require('dns').promises;
    let smtpHost = 'smtp.gmail.com';
    try {
      const { address } = await dns.lookup('smtp.gmail.com', { family: 4 });
      smtpHost = address;
      console.log(`[EMAIL] IPv4 resuelta para smtp.gmail.com: ${smtpHost}`);
    } catch (e) {
      console.error(`[EMAIL] Error resolviendo IPv4 para smtp.gmail.com:`, e.message);
    }

    return nodemailer.createTransport({
      host: smtpHost,
      port: 587,
      secure: false, // false para 587 (usa STARTTLS), true para 465
      auth: { user, pass },
      tls: {
        servername: 'smtp.gmail.com', // Requerido si nos conectamos por IP
        // Esto ayuda si Docker tiene problemas con los certificados raíz
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
    } as any);
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

    const transporter = await this.createTransporter();
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
    console.log(`[EMAIL] ========================================`);
    console.log(`[EMAIL] Enviando código de verificación a: ${email}`);
    console.log(`[EMAIL] ========================================`);

    // Respaldo en consola
    console.log(`\n\n=========================================\n[EMAIL BYPASS] CÓDIGO DE VERIFICACIÓN PARA ${email}:\n>>> ${code} <<<\n=========================================\n\n`);

    const brevoApiKey = this.configService.get('BREVO_API_KEY') || process.env.BREVO_API_KEY;
    const emailUser = this.configService.get('EMAIL_USER');
    
    if (!brevoApiKey) {
      throw new InternalServerErrorException('Falta la configuración de BREVO_API_KEY en el servidor.');
    }

    try {
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Verificación de Seguridad</h2>
          <p>Tu código de verificación es:</p>
          <h1 style="color: #BC2041; letter-spacing: 5px;">${code}</h1>
          <p>Este código expirará en 15 minutos.</p>
          <p>Si no solicitaste este código, ignora este correo.</p>
        </div>
      `;

      // Usamos la API HTTP de Brevo (Sendinblue) para saltarnos el bloqueo SMTP de Railway
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify({
          sender: { email: emailUser || 'jn147860@gmail.com', name: 'Elegant Cut' },
          to: [{ email: email }],
          subject: 'Código de Verificación - Elegant Cut',
          htmlContent: htmlContent
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error de Brevo: ${errorData}`);
      }

      console.log(`[EMAIL] Correo enviado exitosamente a ${email} vía Brevo HTTP API.`);
      return true;
    } catch (error) {
      console.error(' [EMAIL BREVO] Error enviando correo:', error.message);
      throw new InternalServerErrorException('Error al enviar correo vía Brevo: ' + error.message);
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
      console.error(' [EMAIL] Credenciales no configuradas para PQRS.');
      return false;
    }

    try {
      const transporter = await this.createTransporter();

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
      //Confirma la pqr enviada
      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL]  Confirmación PQRS enviada a ${email}`);
      return true;
    } catch (error) {
      console.error(' [EMAIL] Error en confirmación PQRS:');
      console.error(`   Mensaje: ${error.message}`);
      console.error(`   Código:  ${error.code}`);
      return false;
    }
  }
}
