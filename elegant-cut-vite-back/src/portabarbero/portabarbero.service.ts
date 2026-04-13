import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortaDto } from './dto/porta.dto';

@Injectable()
export class PortabarberoService {
    constructor(private prisma: PrismaService) { }

    // creamos la lógica del metodo post
    async crearPortafolio(datos: CreatePortaDto) {
        return await this.prisma.portafolios.create({
            data: {
                ...datos,
                especialidades: datos.especialidades ? JSON.stringify(datos.especialidades) : undefined,
                fotos_portafolio: datos.fotos_portafolio ? JSON.stringify(datos.fotos_portafolio) : undefined,
            },
        });
    }


    // este es para el método get
    async getPortafolioByBarber(id: number) {
        return await this.prisma.portafolios.findFirst({
            where: { id_usuario: id }
        })
    }
}


