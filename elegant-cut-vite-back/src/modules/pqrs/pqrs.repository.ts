import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PqrsRepository {
    constructor(private prisma: PrismaService) { }

    // NOTA: La tabla 'pqrs' no existe aún en tu MySQL.
    // Hay que crearla primero y luego correr:
    //   npx prisma db pull
    //   npx prisma generate
    // Mientras tanto estos métodos están preparados pero lanzarán error en runtime.

    async create(data: any) {
        const { tipo_solicitud, nombre_completo, identificacion, email, telefono, asunto, descripcion, medio_respuesta, estado, respuesta } = data;
        const result = await this.prisma.pqrs.create({
            data: {
                tipo_solicitud,
                nombre_completo,
                identificacion,
                email,
                telefono,
                asunto,
                descripcion,
                medio_respuesta: medio_respuesta || 'email',
                estado: estado || 'pendiente',
                respuesta
            }
        });
        return result.id_pqrs;
    }

    async findByUserData(email: string) {
        return this.prisma.pqrs.findMany({
            where: {
                email: email
            }
        });
    }
}
