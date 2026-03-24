import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PqrsRepository {
    constructor(private prisma: PrismaService) { }

    // Hay que crearla primero y luego correr:
    //   npx prisma db pull
    //   npx prisma generate
    // Mientras tanto estos métodos están preparados pero lanzarán error en runtime.

    async create(data: any) {
        // Adaptado al nuevo esquema de la base de datos
        const { tipo, asunto, descripcion, id_usuario, estado } = data;
        const result = await this.prisma.pqrs.create({
            data: {
                tipo: tipo || 'Peticion', // Valor por defecto del enum pqrs_tipo si no viene
                asunto,
                descripcion,
                estado: estado || 'Pendiente', // Valor por defecto del enum pqrs_estado
                id_usuario
            }
        });
        return result.id_pqrs;
    }

    async findByUserData(email: string) {
        // En el nuevo esquema, se busca a través de la relación con la tabla 'usuarios'
        return this.prisma.pqrs.findMany({
            where: {
                usuarios: {
                    email: email
                }
            },
            include: {
                usuarios: true // Puede ser útil traer la info del usuario
            }
        });
    }
}
