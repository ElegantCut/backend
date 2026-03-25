import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    [x: string]: any;
    portafolio_barbero: any;
    async onModuleInit() {
        // Esto asegura que la conexión se establezca al iniciar el servidor
        await this.$connect();
    }
}