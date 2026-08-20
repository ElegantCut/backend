const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  const b = await prisma.usuarios.findFirst({ where: { id_rol: 3 } });
  console.log(b.id_usuario);
}
test();
