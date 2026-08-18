const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    await prisma.portafolios.deleteMany({ where: { id_usuario: 85 } });
    const res = await prisma.portafolios.create({
      data: {
        id_usuario: 85,
        biografia: ""
      }
    });
    console.log(res);
  } catch (err) {
    console.error("PRISMA ERROR:", err);
  }
}

test();
