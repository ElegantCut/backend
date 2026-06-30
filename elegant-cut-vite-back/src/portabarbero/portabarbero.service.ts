import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortaDto } from './dto/porta.dto';

@Injectable()
export class PortabarberoService {
  constructor(private prisma: PrismaService) {}

  // creamos la lógica del metodo post (ahora soporta upsert para permitir actualización)
  async crearPortafolio(datos: CreatePortaDto) {
    const specs = datos.especialidades
      ? JSON.stringify(datos.especialidades)
      : undefined;
    const fotos = datos.fotos_portafolio
      ? JSON.stringify(datos.fotos_portafolio)
      : undefined;

    return await this.prisma.portafolios.upsert({
      where: { id_usuario: Number(datos.id_usuario) },
      update: {
        biografia: datos.biografia,
        experiencia: datos.experiencia,
        instagram: datos.instagram,
        especialidades: specs,
        fotos_portafolio: fotos,
      },
      create: {
        id_usuario: Number(datos.id_usuario),
        biografia: datos.biografia,
        experiencia: datos.experiencia,
        instagram: datos.instagram,
        especialidades: specs,
        fotos_portafolio: fotos,
      },
    });
  }

  // este es para el método get
  async getPortafolioByBarber(id: number) {
    return await this.prisma.portafolios.findFirst({
      where: { id_usuario: id },
    });
  }
}
