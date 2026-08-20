const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
    try {
        const describe = await prisma.$queryRaw`DESCRIBE portafolios`;
        console.log("DESCRIBE:", describe);
        
        const triggers = await prisma.$queryRaw`SHOW TRIGGERS LIKE 'portafolios'`;
        console.log("TRIGGERS:", triggers);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
debug();
