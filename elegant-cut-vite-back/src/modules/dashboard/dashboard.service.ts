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
    const stats = statsResult.data;

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      const chunks: any[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', (err) => reject(err));

      // Colores de la paleta
      const primaryColor = '#007AFF'; // iOS Blue
      const secondaryColor = '#8E8E93'; // iOS Gray
      const successColor = '#34C759'; // iOS Green
      const dangerColor = '#FF3B30'; // iOS Red
      const warningColor = '#FF9500'; // iOS Orange
      const textColor = '#1C1C1E'; // iOS Dark text
      const lightBg = '#F2F2F7'; // iOS Light background

      // Encabezado principal (Header)
      doc
        .fillColor(primaryColor)
        .fontSize(26)
        .font('Helvetica-Bold')
        .text('ELEGANT CUT', 50, 50);

      doc
        .fillColor(textColor)
        .fontSize(10)
        .font('Helvetica')
        .text('SISTEMA DE GESTIÓN DE BARBERÍA', 50, 80);

      // Línea divisoria superior
      doc
        .strokeColor(primaryColor)
        .lineWidth(2)
        .moveTo(50, 95)
        .lineTo(545, 95)
        .stroke();

      // Información del Reporte
      doc
        .fillColor(textColor)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('Reporte General de Estadísticas', 50, 115);

      const fechaActual = new Date().toLocaleString('es-ES', {
        dateStyle: 'long',
        timeStyle: 'short',
      });

      doc
        .fillColor(secondaryColor)
        .fontSize(10)
        .font('Helvetica')
        .text(`Generado el: ${fechaActual}`, 50, 140)
        .moveDown(2);

      // Sección 1: Tarjetas / Widgets de Métricas Clave
      const cardY = 175;
      const cardWidth = 110;
      const cardHeight = 80;
      const spacing = 12;

      // Tarjeta 1: Citas Hoy
      this.drawMetricCard(doc, 50, cardY, cardWidth, cardHeight, 'Citas Hoy', stats.citasHoy.toString(), primaryColor, lightBg);

      // Tarjeta 2: Ingresos Hoy
      this.drawMetricCard(doc, 50 + cardWidth + spacing, cardY, cardWidth, cardHeight, 'Ingresos Hoy', `$${stats.ingresosHoy.toLocaleString('es-ES')}`, successColor, lightBg);

      // Tarjeta 3: Clientes Nuevos
      this.drawMetricCard(doc, 50 + (cardWidth + spacing) * 2, cardY, cardWidth, cardHeight, 'Clientes Nuevos', stats.clientesNuevos.toString(), dangerColor, lightBg);

      // Tarjeta 4: Citas Pendientes
      this.drawMetricCard(doc, 50 + (cardWidth + spacing) * 3, cardY, cardWidth, cardHeight, 'Pendientes', stats.citasPendientes.toString(), warningColor, lightBg);

      // Sección 2: Resumen del Estado de Citas
      doc
        .fillColor(textColor)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Resumen del Estado de Citas', 50, 290)
        .moveDown(1);

      // Dibujar caja de resumen
      const summaryY = 320;
      doc
        .roundedRect(50, summaryY, 495, 100, 8)
        .fillAndStroke(lightBg, '#E5E5EA');

      // Texto dentro de la caja de resumen
      const colWidth = 165;

      // Columna 1: Completadas
      doc
        .fillColor(successColor)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text(stats.citasCompletadas.toString(), 50 + 20, summaryY + 25, { width: colWidth - 40, align: 'center' })
        .fillColor(textColor)
        .fontSize(11)
        .font('Helvetica')
        .text('Completadas', 50 + 20, summaryY + 55, { width: colWidth - 40, align: 'center' });

      // Columna 2: Pendientes
      doc
        .fillColor(warningColor)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text(stats.citasPendientes.toString(), 50 + colWidth + 20, summaryY + 25, { width: colWidth - 40, align: 'center' })
        .fillColor(textColor)
        .fontSize(11)
        .font('Helvetica')
        .text('Pendientes', 50 + colWidth + 20, summaryY + 55, { width: colWidth - 40, align: 'center' });

      // Columna 3: Canceladas
      doc
        .fillColor(dangerColor)
        .fontSize(22)
        .font('Helvetica-Bold')
        .text(stats.citasCanceladas.toString(), 50 + colWidth * 2 + 20, summaryY + 25, { width: colWidth - 40, align: 'center' })
        .fillColor(textColor)
        .fontSize(11)
        .font('Helvetica')
        .text('Canceladas', 50 + colWidth * 2 + 20, summaryY + 55, { width: colWidth - 40, align: 'center' });

      // Líneas divisorias de la tabla de resumen
      doc
        .strokeColor('#E5E5EA')
        .lineWidth(1)
        .moveTo(50 + colWidth, summaryY + 20)
        .lineTo(50 + colWidth, summaryY + 80)
        .moveTo(50 + colWidth * 2, summaryY + 20)
        .lineTo(50 + colWidth * 2, summaryY + 80)
        .stroke();

      // Footer
      doc
        .strokeColor('#E5E5EA')
        .lineWidth(1)
        .moveTo(50, 720)
        .lineTo(545, 720)
        .stroke();

      doc
        .fillColor(secondaryColor)
        .fontSize(8)
        .font('Helvetica')
        .text('Elegant Cut - Reporte del Administrador. Generado automáticamente.', 50, 735, { align: 'center' });

      doc.end();
    });
  }

  private drawMetricCard(
    doc: any,
    x: number,
    y: number,
    width: number,
    height: number,
    title: string,
    value: string,
    color: string,
    bgColor: string
  ) {
    doc
      .roundedRect(x, y, width, height, 8)
      .fillAndStroke(bgColor, '#E5E5EA');

    doc
      .fillColor('#8E8E93')
      .fontSize(9)
      .font('Helvetica-Bold')
      .text(title.toUpperCase(), x + 10, y + 15, { width: width - 20 });

    doc
      .fillColor(color)
      .fontSize(18)
      .font('Helvetica-Bold')
      .text(value, x + 10, y + 35, { width: width - 20 });
  }
}
