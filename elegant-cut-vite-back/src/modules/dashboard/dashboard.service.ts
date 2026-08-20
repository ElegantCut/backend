import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFDocument = require('pdfkit');

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepo: DashboardRepository) {}

  async getStats() {
    return this.dashboardRepo.getSummaryStats();
  }

  async getActivity() {
    return this.dashboardRepo.getRecentActivity();
  }

  async generateStatsPdf(): Promise<Buffer> {
    const statsResult = await this.getStats();
    const stats = statsResult.data || { citasHoy: 0, ingresosHoy: 0, clientesNuevos: 0, citasPendientes: 0, citasCompletadas: 0, citasCanceladas: 0 };
    const activityResult = await this.getActivity();
    const activity = activityResult || [];

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 0, // Controlamos los márgenes manualmente
      });

      const chunks: any[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // --- PALETA DE COLORES PREMIUM (Beauty / Spa) ---
      const darkBg = '#111111';
      const goldAccent = '#D4AF37'; // Dorado premium
      const lightBg = '#F8F9FA';
      const cardBg = '#FFFFFF';
      const textDark = '#1A1A1A';
      const textMuted = '#6C757D';
      
      const successColor = '#2E7D32';
      const warningColor = '#F57F17';
      const dangerColor = '#C62828';

      // --- FONDO GENERAL ---
      doc.rect(0, 0, doc.page.width, doc.page.height).fill(lightBg);

      // --- HEADER ---
      doc.rect(0, 0, doc.page.width, 120).fill(darkBg);
      
      // Detalles dorados en header
      doc.rect(0, 116, doc.page.width, 4).fill(goldAccent);

      doc.fillColor('#FFFFFF')
         .fontSize(32)
         .font('Helvetica-Bold')
         .text('ELEGANT CUT', 50, 40);

      doc.fillColor(goldAccent)
         .fontSize(12)
         .font('Helvetica')
         .text('EXECUTIVE DASHBOARD REPORT', 50, 75, { letterSpacing: 2 });

      const fechaActual = new Date().toLocaleString('es-ES', {
        dateStyle: 'long',
        timeStyle: 'short',
      });

      doc.fillColor('#AAAAAA')
         .fontSize(10)
         .text(`Generado: ${fechaActual}`, doc.page.width - 250, 50, { align: 'right', width: 200 });

      // --- MÉTRICAS PRINCIPALES ---
      let currentY = 160;
      doc.fillColor(textDark)
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('RESUMEN DE MÉTRICAS (HOY)', 50, currentY);

      currentY += 30;
      const cardWidth = 110;
      const cardHeight = 80;
      const spacing = 18;

      this.drawPremiumCard(doc, 50, currentY, cardWidth, cardHeight, 'CITAS HOY', (stats.citasHoy || 0).toString(), goldAccent);
      this.drawPremiumCard(doc, 50 + cardWidth + spacing, currentY, cardWidth, cardHeight, 'INGRESOS HOY', `$${(stats.ingresosHoy || 0).toLocaleString('es-ES')}`, successColor);
      this.drawPremiumCard(doc, 50 + (cardWidth + spacing) * 2, currentY, cardWidth, cardHeight, 'CLIENTES NUEVOS', (stats.clientesNuevos || 0).toString(), textDark);
      this.drawPremiumCard(doc, 50 + (cardWidth + spacing) * 3, currentY, cardWidth, cardHeight, 'PENDIENTES', (stats.citasPendientes || 0).toString(), warningColor);

      // --- ESTADO GENERAL DE CITAS ---
      currentY += 120;
      doc.fillColor(textDark)
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('ESTADO GENERAL DE CITAS', 50, currentY);

      currentY += 30;
      doc.roundedRect(50, currentY, doc.page.width - 100, 70, 6)
         .fill(cardBg)
         .lineWidth(1)
         .strokeColor('#E0E0E0')
         .stroke();

      const colW = (doc.page.width - 100) / 3;
      
      this.drawStatusCol(doc, 50, currentY, colW, 'Completadas', (stats.citasCompletadas || 0).toString(), successColor);
      this.drawStatusCol(doc, 50 + colW, currentY, colW, 'Pendientes', (stats.citasPendientes || 0).toString(), warningColor);
      this.drawStatusCol(doc, 50 + colW * 2, currentY, colW, 'Canceladas', (stats.citasCanceladas || 0).toString(), dangerColor);

      // Líneas separadoras
      doc.moveTo(50 + colW, currentY + 15).lineTo(50 + colW, currentY + 55).strokeColor('#E0E0E0').stroke();
      doc.moveTo(50 + colW * 2, currentY + 15).lineTo(50 + colW * 2, currentY + 55).strokeColor('#E0E0E0').stroke();

      // --- ACTIVIDAD RECIENTE (TABLA) ---
      currentY += 110;
      doc.fillColor(textDark)
         .fontSize(16)
         .font('Helvetica-Bold')
         .text('ÚLTIMAS CITAS REGISTRADAS', 50, currentY);

      currentY += 30;
      
      // Tabla Header
      doc.rect(50, currentY, doc.page.width - 100, 30).fill(darkBg);
      doc.fillColor(goldAccent).fontSize(10).font('Helvetica-Bold');
      doc.text('ID', 60, currentY + 10, { width: 50 });
      doc.text('CLIENTE', 120, currentY + 10, { width: 150 });
      doc.text('FECHA Y HORA', 280, currentY + 10, { width: 150 });
      doc.text('ESTADO', 440, currentY + 10, { width: 100 });

      currentY += 30;

      // Filas de la tabla
      doc.font('Helvetica').fontSize(10);
      let isEven = false;

      if (activity.length === 0) {
          doc.rect(50, currentY, doc.page.width - 100, 40).fill(cardBg);
          doc.fillColor(textMuted).text('No hay citas recientes registradas.', 50, currentY + 15, { align: 'center', width: doc.page.width - 100 });
      } else {
          for (const item of activity) {
            doc.rect(50, currentY, doc.page.width - 100, 30).fill(isEven ? '#F8F9FA' : cardBg);
            
            doc.fillColor(textDark);
            doc.text(`#${item.id_reservas}`, 60, currentY + 10, { width: 50 });
            doc.text(`${item.usuarios?.prim_nombre || 'N/A'} ${item.usuarios?.apellido1 || ''}`, 120, currentY + 10, { width: 150 });
            
            const dateStr = new Date(item.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
            doc.text(dateStr, 280, currentY + 10, { width: 150 });

            let estadoText = 'Desconocido';
            let estadoColor = textDark;
            if (item.id_estado_cita === 1) { estadoText = 'Pendiente'; estadoColor = warningColor; }
            if (item.id_estado_cita === 2) { estadoText = 'Completada'; estadoColor = successColor; }
            if (item.id_estado_cita === 3) { estadoText = 'Cancelada'; estadoColor = dangerColor; }

            doc.fillColor(estadoColor).font('Helvetica-Bold').text(estadoText, 440, currentY + 10, { width: 100 });
            doc.font('Helvetica');

            currentY += 30;
            isEven = !isEven;
            
            // Paginación si se pasa de página
            if (currentY > doc.page.height - 100) {
               doc.addPage();
               doc.rect(0, 0, doc.page.width, doc.page.height).fill(lightBg);
               currentY = 50;
            }
          }
      }

      // --- FOOTER ---
      const footerY = doc.page.height - 60;
      doc.moveTo(50, footerY).lineTo(doc.page.width - 50, footerY).strokeColor('#E0E0E0').stroke();
      doc.fillColor(textMuted)
         .fontSize(9)
         .text('Elegant Cut - Confidencial. Uso exclusivo administrativo.', 50, footerY + 15, { align: 'center', width: doc.page.width - 100 });

      doc.end();
    });
  }

  private drawPremiumCard(doc: any, x: number, y: number, w: number, h: number, title: string, value: string, valueColor: string) {
    doc.roundedRect(x, y, w, h, 6)
       .fill('#FFFFFF')
       .lineWidth(1)
       .strokeColor('#E0E0E0')
       .stroke();

    doc.fillColor('#6C757D')
       .fontSize(9)
       .font('Helvetica-Bold')
       .text(title, x + 10, y + 15, { width: w - 20, align: 'left' });

    doc.fillColor(valueColor)
       .fontSize(22)
       .font('Helvetica-Bold')
       .text(value, x + 10, y + 35, { width: w - 20, align: 'left' });
  }

  private drawStatusCol(doc: any, x: number, y: number, w: number, label: string, value: string, color: string) {
    doc.fillColor(color)
       .fontSize(24)
       .font('Helvetica-Bold')
       .text(value, x, y + 15, { width: w, align: 'center' });
       
    doc.fillColor('#6C757D')
       .fontSize(10)
       .font('Helvetica')
       .text(label, x, y + 45, { width: w, align: 'center' });
  }
}
