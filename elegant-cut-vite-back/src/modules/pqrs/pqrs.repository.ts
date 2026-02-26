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
        // TODO: descomentar cuando la tabla pqrs exista en MySQL y el schema esté actualizado
        // const { requestType, userName, userId, userEmail, userPhone, subject, description, responseMedium } = data;
        // const result = await this.prisma.pqrs.create({ ... });
        // return result.id_pqrs;
        throw new Error('Tabla pqrs no existe en la base de datos. Créala y ejecuta npx prisma db pull + npx prisma generate');
    }

    async findByUserData(email: string, phone: string) {
        // TODO: descomentar cuando la tabla pqrs exista en MySQL y el schema esté actualizado
        // return this.prisma.pqrs.findMany({ ... });
        throw new Error('Tabla pqrs no existe en la base de datos. Créala y ejecuta npx prisma db pull + npx prisma generate');
    }
}
