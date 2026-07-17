const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showCreate() {
    try {
        const result = await prisma.$queryRaw`SHOW CREATE TABLE portafolios`;
        console.log("SCHEMA:", result[0]['Create Table']);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
showCreate();
