import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    constructor(private configService: ConfigService) { }

    /**
     * Crea el transporter en el momento del envío (no en el constructor),
     * para garantizar que las variables de entorno ya estén cargadas.
     */
    private createTransporter() {
        const user = this.configService.get<string>('EMAIL_USER');
        // Quitar los espacios del App Password (Google a veces los rechaza si se envían con espacios)
        const rawPass = this.configService.get<string>('EMAIL_PASS') || '';
        const pass = rawPass.replace(/\s+/g, '');

        console.log(`[EMAIL] Configurando transporter con usuario: ${user ? user : '⚠️ NO DEFINIDO'}`);

        return nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: { user, pass },
            tls: {
                // Esto ayuda si Docker tiene problemas con los certificados raíz
                rejectUnauthorized: false
            }
        });
    }

    async sendVerificationCode(email: string, code: string): Promise<boolean> {
        const emailUser = this.configService.get('EMAIL_USER');
        const emailPass = this.configService.get('EMAIL_PASS');

        console.log(`[EMAIL] Iniciando envío de código ${code} a ${email}`);
        console.log(`[EMAIL] EMAIL_USER configurado: ${emailUser ? '✅ SÍ' : '❌ NO'}`);
        console.log(`[EMAIL] EMAIL_PASS configurado: ${emailPass ? '✅ SÍ' : '❌ NO'}`);

        if (!emailUser || !emailPass) {
            console.error('❌ [EMAIL] Credenciales no configuradas. Revisa EMAIL_USER y EMAIL_PASS en el .env');
            return false;
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
            // Lanza el error para que el endpoint devuelva 500 en lugar de fingir éxito
            throw new InternalServerErrorException(`No se pudo enviar el correo: ${error.message}`);
        }
    }

    async sendPqrsConfirmation(email: string, userName: string, radicado: string, type: string): Promise<boolean> {
        const emailUser = this.configService.get('EMAIL_USER');
        const emailPass = this.configService.get('EMAIL_PASS');

        if (!emailUser || !emailPass) {
            console.error('❌ [EMAIL] Credenciales no configuradas para PQRS.');
            return false;
        }

        try {
            const transporter = this.createTransporter();

            const message = type === 'peticion' ? '¡Tu petición fue exitosa!' :
                type === 'queja' ? '¡Tu queja fue exitosa!' :
                    `Tu ${type} ha sido radicada exitosamente.`;

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
