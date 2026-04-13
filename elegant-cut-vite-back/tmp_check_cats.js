const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cats = await prisma.categorias.findMany({
    include: { genero_servicio: true }
  });
  console.log(JSON.stringify(cats, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
