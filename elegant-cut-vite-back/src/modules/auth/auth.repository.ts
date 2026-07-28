import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { codigos_verificacion_tipo } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async findValidVerificationCode(
    email: string,
    codigo: string,
    tipo: codigos_verificacion_tipo,
  ) {
    return this.prisma.codigos_verificacion.findFirst({
      where: {
        email: email,
        codigo: codigo,
        tipo: tipo,
        usado: false,
        expira_en: { gte: new Date() }, // Verifica que no haya expirado
      },
    });
  }

  async markCodeAsUsed(id: number) {
    return this.prisma.codigos_verificacion.update({
      where: { id },
      data: { usado: true },
    });
  }

  async createVerificationCode(data: {
    email: string;
    codigo: string;
    tipo: codigos_verificacion_tipo;
    expira_en: Date;
    usado: boolean;
  }) {
    return this.prisma.codigos_verificacion.create({
      data,
    });
  }
}
