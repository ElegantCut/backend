import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS'),
            },
        });
    }

    async sendVerificationCode(email: string, code: string): Promise<boolean> {
        try {
            console.log(`[EMAIL] Enviando código ${code} a ${email}`);

            if (!this.configService.get('EMAIL_USER') || !this.configService.get('EMAIL_PASS')) {
                console.log('⚠️ Credenciales de email no configuradas. Simulación exitosa.');
                return true;
            }

            const mailOptions = {
                from: this.configService.get('EMAIL_USER'),
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

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error enviando email:', error);
            return true;
        }
    }

    async sendPqrsConfirmation(email: string, userName: string, radicado: string, type: string): Promise<boolean> {
        try {
            if (!this.configService.get('EMAIL_USER') || !this.configService.get('EMAIL_PASS')) {
                return true;
            }

            const message = type === 'peticion' ? '¡Tu petición fue exitosa!' :
                type === 'queja' ? '¡Tu queja fue exitosa!' :
                    `Tu ${type} ha sido radicada exitosamente.`;

            const mailOptions = {
                from: this.configService.get('EMAIL_USER'),
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

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error en confirmación PQRS:', error);
            return true;
        }
    }
}
