import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.usuarios.findMany();
    console.log("Usuarios en la base de datos:", users.length);
    console.log(users);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
// import { Controller, Post, Body } from '@nestjs/common';
// import { ServiceU } from 'src/modules/service_u/serviceu.controller';

/*
@Controller('service_U')
export class ServiceUController {

    constructor(private readonly serviceU: any) {
    }

    @Post()
    async create(@Body() data: any) {
        return this.serviceU.create(data);
    }
}
*/
