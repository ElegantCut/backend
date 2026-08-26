const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const existing = await prisma.horarios.findMany();
  console.log(existing);
}
main().catch(console.error).finally(() => prisma.$disconnect());
