import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BarbersRepository {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.usuarios.findMany({
      where: { id_rol: 3 },
      include: {
        _count: { select: { reservas: true } },
        portafolios: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findActive() {
    return (this.prisma.usuarios as any).findMany({
      where: { id_rol: 3, estado: true },
      include: {
        portafolios: true,
        resenas_recibidas: {
          where: { estado: 1 },
          select: { calificacion: true },
        },
      },
      orderBy: { prim_nombre: 'asc' },
    });
  }

  async findById(id: number) {
    return this.prisma.usuarios.findFirst({
      where: { id_usuario: id, id_rol: 3 },
    });
  }

  async getStats(id: number) {
    const total = await this.prisma.reservas.count();
    const completadas = await this.prisma.reservas.count({
      where: { id_estado_cita: 2 },
    });
    return { total_citas: total, citas_completadas: completadas };
  }

  // --- NUEVOS MÉTODOS DE REPOSITORIO PARA CUMPLIR CON SOLID ---

  async findAllWithPortfolioAndReviews(orderByCreated = false) {
    return (this.prisma.usuarios as any).findMany({
      where: { id_rol: 3 },
      orderBy: orderByCreated ? { created_at: 'desc' } : undefined,
      include: {
        portafolios: true,
        resenas_recibidas: {
          where: { estado: 1 },
          select: { calificacion: true },
        },
      },
    });
  }

  async createBarberWithPortfolio(userData: any, portfolioData: any) {
    return this.prisma.usuarios.create({
      data: {
        ...userData,
        id_rol: 3,
        estado: true,
        portafolios: {
          create: portfolioData,
        },
      },
    });
  }

  async findOneWithDetails(id: number) {
    return (this.prisma.usuarios as any).findFirst({
      where: { id_usuario: id, id_rol: 3 },
      include: {
        portafolios: true,
        barberos_servicios: {
          include: { servicios: true },
        },
        resenas_recibidas: {
          where: { estado: 1 },
          select: { calificacion: true },
        },
      },
    });
  }

  async updateBarber(id: number, data: any) {
    return this.prisma.usuarios.update({
      where: { id_usuario: id },
      data,
    });
  }

  async findPortfolioByUserId(userId: number) {
    return this.prisma.portafolios.findFirst({
      where: { id_usuario: userId },
    });
  }

  async updatePortfolio(portfolioId: number, data: any) {
    return this.prisma.portafolios.update({
      where: { id_portafolio: portfolioId },
      data,
    });
  }

  async createPortfolio(data: any) {
    return this.prisma.portafolios.create({
      data,
    });
  }
}
